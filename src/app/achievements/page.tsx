"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '@/lib/game-constants';
import { ACHIEVEMENTS, type Achievement } from '@/lib/achievements';
import { AchievementCard } from '@/components/game/AchievementCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-4xl mx-auto mt-8">
            <div className="flex justify-start w-full mb-6">
                <Button asChild variant="outline">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Game
                    </Link>
                </Button>
            </div>
            <Card className="shadow-xl border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-center text-4xl font-headline tracking-wide">Achievements</CardTitle>
                    <p className="text-center text-muted-foreground">
                        You've unlocked {unlockedCount} of {totalCount} achievements.
                    </p>
                    <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ACHIEVEMENTS.map((achievement, index) => (
                            <AchievementCard 
                                key={achievement.id}
                                achievement={achievement}
                                isUnlocked={unlockedAchievements.includes(achievement.id)}
                                style={{ animationDelay: `${index * 50}ms`}}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </main>
      </div>

      <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
        <a href="https://firebase.google.com/docs/studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
            Powered by Firebase Studio <Sparkles className="w-4 h-4 text-accent" />
        </a>
      </footer>
    </div>
  );
}