
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, ShoppingCart, Sparkles, CircleDollarSign } from 'lucide-react';
import { HighScores } from '@/components/game/HighScores';
import { useUserData } from '@/hooks/use-user-data';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { LOCAL_STORAGE_KEYS } from '@/lib/game-constants';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const { coins } = useUserData();
  const [unlockedCount, setUnlockedCount] = useState(0);
  const totalAchievements = ACHIEVEMENTS.length;
  const achievementProgress = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) {
        const unlockedIds = JSON.parse(saved);
        setUnlockedCount(unlockedIds.length);
      }
    } catch (error) {
        console.error("Could not load achievements from localStorage", error);
    }
    
    const handleStorageChange = () => {
       const savedAchievements = localStorage.getItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS);
       setUnlockedCount(savedAchievements ? JSON.parse(savedAchievements).length : 0);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-5xl mx-auto mt-8">
          <div className="flex justify-start w-full mb-6">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Game
              </Link>
            </Button>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-wide text-primary">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Your game progress and collection at a glance.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <HighScores />
            </div>
            
            <div className="flex flex-col gap-8">
              <Card className="group shadow-lg border-border/80 hover:border-primary/50 transition-all transform hover:-translate-y-1 overflow-hidden">
                 <CardHeader className="bg-muted/50 p-6">
                  <CardTitle className="flex items-center gap-4 text-2xl font-headline tracking-wide">
                    <Trophy className="w-10 h-10 text-yellow-500 transition-transform group-hover:scale-125 group-hover:rotate-[-10deg]" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                      <span>Progress</span>
                      <span>{unlockedCount} / {totalAchievements}</span>
                  </div>
                  <Progress value={achievementProgress} className="h-2 mb-4" />
                  <p className="text-muted-foreground mb-4 text-sm">
                    Track your milestones and unlock special badges for your accomplishments.
                  </p>
                  <Link href="/achievements" passHref>
                    <Button className="w-full" variant="outline">View All Achievements</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group shadow-lg border-border/80 hover:border-primary/50 transition-all transform hover:-translate-y-1 overflow-hidden">
                <CardHeader className="bg-muted/50 p-6">
                  <CardTitle className="flex items-center gap-4 text-2xl font-headline tracking-wide">
                    <ShoppingCart className="w-10 h-10 text-green-500 transition-transform group-hover:scale-125 group-hover:rotate-[10deg]" />
                    <span>FlipFun Shop</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="flex items-center justify-center gap-2 text-xl font-bold mb-4 bg-amber-400/10 text-amber-500 p-3 rounded-lg">
                      <CircleDollarSign className="w-6 h-6"/>
                      <span>{coins}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Spend your coins on powerful boosts and unique card styles.
                  </p>
                  <Link href="/shop" passHref>
                    <Button className="w-full">Go to Shop</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
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
