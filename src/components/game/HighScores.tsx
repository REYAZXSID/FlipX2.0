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
    <Card className="shadow-lg border-border/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-headline tracking-wide">
            <Trophy className="w-8 h-8 text-yellow-500" />
            High Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {GRID_SIZES.map(size => {
            const score = highScores[size.value];
            return (
              <div key={size.value} className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                <p className="font-semibold">{size.label}</p>
                {score ? (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Move className="w-4 h-4 text-primary"/>
                      <span>{score.moves}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-primary"/>
                      <span>{formatTime(score.time)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not Played Yet</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}