"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Trophy, ShoppingCart, Sparkles } from 'lucide-react';
import { HighScores } from '@/components/game/HighScores';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-5xl mx-auto mt-8">
          <div className="flex justify-start w-full mb-6">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Game Setup
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <HighScores />
            </div>
            
            <div className="lg:col-span-2 flex flex-col gap-8">
              <Card className="group shadow-lg border-border/80 hover:border-primary/50 transition-all transform hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-headline tracking-wide">
                    <Trophy className="w-8 h-8 text-yellow-500 transition-transform group-hover:scale-125 group-hover:rotate-[-10deg]" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Track your progress and unlock cool badges!</p>
                  <Link href="/achievements" passHref>
                    <Button className="w-full" variant="outline">View Achievements</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group shadow-lg border-border/80 hover:border-primary/50 transition-all transform hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-headline tracking-wide">
                    <ShoppingCart className="w-8 h-8 text-green-500 transition-transform group-hover:scale-125 group-hover:rotate-[10deg]" />
                    Shop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Buy power-ups and customize your game!</p>
                  <Link href="/shop" passHref>
                    <Button className="w-full" variant="outline">Go to Shop</Button>
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
