
"use client";

import React from 'react';
import ReactConfetti from "react-confetti"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import type { Achievement } from "@/lib/achievements";
import { UnlockedAchievements } from "./UnlockedAchievements";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trophy, CircleDollarSign, Timer, Move, X } from "lucide-react";
import { useWindowSize } from "react-use";

type GameWonDialogProps = {
  isOpen: boolean;
  moves: number;
  time: number;
  gridSize: number;
  onPlayAgain: () => void;
  onNewGame: () => void;
  isNewHighScore: boolean;
  unlockedAchievements: Achievement[];
  coinsEarned: number;
  gameMode: string;
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function GameWonDialog({
  isOpen,
  moves,
  time,
  onPlayAgain,
  onNewGame,
  isNewHighScore,
  unlockedAchievements,
  coinsEarned,
}: GameWonDialogProps) {
  const { width, height } = useWindowSize();
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onNewGame()}>
       {isOpen && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={400} gravity={0.15} />}
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center text-center -mt-12">
          <div className="bg-primary/10 p-4 rounded-full border-4 border-background mb-4">
            <Trophy className="w-16 h-16 text-primary animate-bounce-slow" />
          </div>
          <DialogTitle className="text-4xl font-headline text-primary tracking-wide">
            You Won!
          </DialogTitle>
          {isNewHighScore && (
            <DialogDescription className="text-lg font-semibold text-accent pt-1 animate-pulse">
                🏆 New High Score! 🏆
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="my-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-muted-foreground"><Timer className="w-4 h-4"/> Time</div>
                <div className="text-2xl font-bold">{formatTime(time)}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-muted-foreground"><Move className="w-4 h-4"/> Moves</div>
                <div className="text-2xl font-bold">{moves}</div>
            </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-500 bg-amber-400/10 p-3 rounded-lg">
            <CircleDollarSign className="w-8 h-8"/>
            <span>You earned {coinsEarned} coins!</span>
        </div>

        {unlockedAchievements.length > 0 && (
          <>
            <Separator className="my-2" />
            <UnlockedAchievements achievements={unlockedAchievements} />
          </>
        )}
        
        <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          <Button onClick={onNewGame} variant="outline" size="lg">New Game</Button>
          <Button onClick={onPlayAgain} size="lg">Play Again</Button>
        </DialogFooter>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
