"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

export function OnboardingDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('card-matcher-onboarded');
    if (!hasOnboarded) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('card-matcher-onboarded', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Card Matcher!</DialogTitle>
          <DialogDescription>
            Here's how to play the game.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ul className="list-disc list-inside space-y-2">
            <li>Select your preferred grid size and card theme.</li>
            <li>Click "Start Game" to begin.</li>
            <li>Click on two cards to flip them over.</li>
            <li>If the cards match, they stay face up.</li>
            <li>If they don't match, they will flip back.</li>
            <li>Match all the pairs to win the game!</li>
            <li>Try to win with the fewest moves and in the shortest time.</li>
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Let's Play!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
