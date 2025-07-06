
"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Code, ArrowLeft, Trophy } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '@/lib/game-constants';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { AchievementCard } from '@/components/game/AchievementCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function AchievementsPage() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) {
        setUnlockedAchievements(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Could not load achievements from localStorage", error);
    }
  }, []);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4 relative overflow-hidden">
      <Trophy className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] text-primary opacity-5 -z-10" />
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-5xl mx-auto mt-8">
            <div className="flex justify-start w-full mb-6">
                <Button asChild variant="outline">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            
            <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-wide text-primary">Achievements</h1>
                <p className="text-muted-foreground mt-2">Celebrate your milestones and unlocked badges.</p>
            </div>

            <Card className="shadow-lg border-border/80 mb-8">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{unlockedCount} / {totalCount}</span>
                    </div>
                    <Progress value={progress} className="h-2.5" />
                     <p className="text-center text-muted-foreground text-sm mt-3">
                        You've unlocked {unlockedCount} of {totalCount} achievements.
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ACHIEVEMENTS.map((achievement, index) => (
                    <AchievementCard 
                        key={achievement.id}
                        achievement={achievement}
                        isUnlocked={unlockedAchievements.includes(achievement.id)}
                        style={{ animationDelay: `${index * 50}ms`}}
                    />
                ))}
            </div>
        </main>
      </div>

      <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
        <p className="inline-flex items-center gap-2">
            Build by Sid <Code className="w-4 h-4 text-accent" />
        </p>
      </footer>
    </div>
  );
}
