"use client";

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

type GameWonDialogProps = {
  isOpen: boolean;
  moves: number;
  time: number;
  gridSize: number;
  onPlayAgain: () => void;
  onNewGame: () => void;
  isNewHighScore: boolean;
  unlockedAchievements: Achievement[];
};

export function GameWonDialog({
  isOpen,
  moves,
  time,
  gridSize,
  onPlayAgain,
  onNewGame,
  isNewHighScore,
  unlockedAchievements
}: GameWonDialogProps) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-4xl font-headline text-primary tracking-wide">
            You Won!
          </AlertDialogTitle>
          {isNewHighScore && (
            <AlertDialogDescription className="text-center text-lg font-semibold text-accent">
                🏆 New High Score! 🏆
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <div className="my-4">
            <GameStats time={time} moves={moves} gridSize={gridSize} />
        </div>
        
        {unlockedAchievements.length > 0 && (
            <UnlockedAchievements achievements={unlockedAchievements} />
        )}
        
        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel onClick={onNewGame} className="w-full sm:w-auto">New Game</AlertDialogCancel>
          <AlertDialogAction onClick={onPlayAgain} className="w-full sm:w-auto">Play Again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
