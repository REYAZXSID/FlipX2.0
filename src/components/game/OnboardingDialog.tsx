
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
import { Gamepad2, CheckCircle } from 'lucide-react';

const instructions = [
  "Select your preferred grid size and card theme.",
  "Click on two cards to flip them over.",
  "If the cards match, they stay face up.",
  "If they don't match, they will flip back.",
  "Match all the pairs to win the game!",
  "Earn coins and unlock achievements."
];

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-2">
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-headline tracking-wide">Welcome to FlipFun!</DialogTitle>
          <DialogDescription>
            A quick guide to get you started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <ul className="space-y-3">
            {instructions.map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{text}</span>
                </li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} size="lg" className="w-full">Let's Play!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
