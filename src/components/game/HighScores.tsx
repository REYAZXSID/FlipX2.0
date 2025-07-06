
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LOCAL_STORAGE_KEYS, GRID_SIZES, type HighScore } from '@/lib/game-constants';
import { Trophy, Timer, Move } from 'lucide-react';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function HighScores() {
  const [highScores, setHighScores] = useState<Record<string, HighScore>>({});

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem(LOCAL_STORAGE_KEYS.HIGH_SCORES);
      if (savedScores) {
        setHighScores(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error('Could not load high scores', error);
    }
    
    const handleStorageChange = () => {
       const savedScores = localStorage.getItem(LOCAL_STORAGE_KEYS.HIGH_SCORES);
       setHighScores(savedScores ? JSON.parse(savedScores) : {});
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Card className="group shadow-lg border-border/80 hover:border-primary/50 transition-all transform hover:-translate-y-1 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-headline tracking-wide">
            <Trophy className="w-8 h-8 text-yellow-500 transition-transform group-hover:scale-110 group-hover:rotate-[-5deg]" />
            High Scores
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          {GRID_SIZES.map(size => {
            const score = highScores[size.value];
            return (
              <div key={size.value} className="flex justify-between items-baseline bg-muted/30 p-4 rounded-lg transition-colors hover:bg-muted/60">
                <div>
                    <p className="font-bold text-lg">{size.label.split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground">{size.label.split(' ').slice(1).join(' ')}</p>
                </div>
                {score ? (
                  <div className="flex items-center gap-4 text-sm font-mono">
                    <div className="flex items-center gap-1.5" title="Moves">
                      <Move className="w-4 h-4 text-primary/80"/>
                      <span className="font-semibold">{score.moves}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Time">
                      <Timer className="w-4 h-4 text-primary/80"/>
                      <span className="font-semibold">{formatTime(score.time)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">--:--</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
