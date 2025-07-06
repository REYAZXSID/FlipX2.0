
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
import { Button } from "@/components/ui/button";
import { Clock, Bomb, XCircle } from "lucide-react";

type GameLostDialogProps = {
  isOpen: boolean;
  onPlayAgain: () => void;
  onNewGame: () => void;
  reason: 'time-up' | 'bomb' | 'mismatch' | null;
};

export function GameLostDialog({
  isOpen,
  onPlayAgain,
  onNewGame,
  reason
}: GameLostDialogProps) {
  if (!isOpen) return null;

  const details = {
    'time-up': {
      Icon: Clock,
      title: "Time's Up!",
      description: "You ran out of time. Better luck next time!",
    },
    'bomb': {
      Icon: Bomb,
      title: "KABOOM!",
      description: "You failed to defuse the bomb card in time.",
    },
    'mismatch': {
      Icon: XCircle,
      title: "Wrong Move!",
      description: "One wrong move is all it takes in Sudden Death.",
    },
    default: {
      Icon: Clock,
      title: "Game Over",
      description: "Better luck next time!",
    }
  }

  const { Icon, title, description } = details[reason || 'default'] || details.default;


  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="items-center text-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <Icon className="w-12 h-12 text-destructive" />
          </div>
          <AlertDialogTitle className="text-3xl sm:text-4xl font-headline text-destructive tracking-wide">
            {title}
          </AlertDialogTitle>
           <AlertDialogDescription className="text-lg pt-1">
                {description}
            </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          <AlertDialogCancel asChild>
            <Button onClick={onNewGame} variant="outline" size="lg">New Game</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onPlayAgain} size="lg">Try Again</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

    