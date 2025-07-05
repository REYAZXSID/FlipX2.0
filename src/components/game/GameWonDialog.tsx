
"use client";

import React from 'react';
import ReactConfetti from "react-confetti"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GameStats } from "./GameStats";
import type { Achievement } from "@/lib/achievements";
import { UnlockedAchievements } from "./UnlockedAchievements";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trophy, CircleDollarSign } from "lucide-react";
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

export function GameWonDialog({
  isOpen,
  moves,
  time,
  gridSize,
  onPlayAgain,
  onNewGame,
  isNewHighScore,
  unlockedAchievements,
  coinsEarned,
  gameMode,
}: GameWonDialogProps) {
  const { width, height } = useWindowSize();
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen}>
       {isOpen && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <Trophy className="w-12 h-12 text-primary animate-bounce" />
          </div>
          <AlertDialogTitle className="text-4xl font-headline text-primary tracking-wide">
            You Won!
          </AlertDialogTitle>
          {isNewHighScore && (
            <AlertDialogDescription className="text-lg font-semibold text-accent pt-1">
                🏆 New High Score! 🏆
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <div className="my-4 p-4 bg-muted/50 rounded-lg">
            <GameStats time={time} moves={moves} gridSize={gridSize} gameMode={gameMode}/>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-500">
            <CircleDollarSign className="w-8 h-8"/>
            <span>You earned {coinsEarned} coins!</span>
        </div>

        {unlockedAchievements.length > 0 && (
          <>
            <Separator className="my-2" />
            <UnlockedAchievements achievements={unlockedAchievements} />
          </>
        )}
        
        <AlertDialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          <AlertDialogCancel asChild>
            <Button onClick={onNewGame} variant="outline" size="lg">New Game</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onPlayAgain} size="lg">Play Again</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
