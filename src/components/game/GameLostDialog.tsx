
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
import { Clock } from "lucide-react";

type GameLostDialogProps = {
  isOpen: boolean;
  onPlayAgain: () => void;
  onNewGame: () => void;
};

export function GameLostDialog({
  isOpen,
  onPlayAgain,
  onNewGame,
}: GameLostDialogProps) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="items-center text-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <Clock className="w-12 h-12 text-destructive" />
          </div>
          <AlertDialogTitle className="text-3xl sm:text-4xl font-headline text-destructive tracking-wide">
            Time's Up!
          </AlertDialogTitle>
           <AlertDialogDescription className="text-lg pt-1">
                Better luck next time!
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
