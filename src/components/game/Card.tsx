
"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Puzzle } from 'lucide-react';

type CardProps = {
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  isMismatched: boolean;
  onClick: () => void;
  isImageType: boolean;
  hint?: string;
  cardBackClass: string;
  customCardBackContent?: string;
  isBomb?: boolean;
};

export function Card({ content, isFlipped, isMatched, isMismatched, onClick, isImageType, hint, cardBackClass, customCardBackContent, isBomb }: CardProps) {
  const handleCardClick = () => {
    if (isFlipped || isMatched) {
      return;
    }
    onClick();
  };

  const cardClasses = cn(
    'card rounded-lg',
    { 'is-flipped': isFlipped || isMatched },
    isMatched ? 'cursor-not-allowed' : 'cursor-pointer',
    isMatched && 'animate-pop'
  );

  return (
    <div className={cn("card-container aspect-square", isMismatched && 'animate-shake')} onClick={handleCardClick}>
      <div className={cardClasses}>
        <div className={cn("card-face card-face-front transition-colors p-2", cardBackClass)}>
          <div className="w-full h-full rounded-md flex items-center justify-center">
            {customCardBackContent ? (
              <Image 
                src={customCardBackContent} 
                alt="Custom card back" 
                fill 
                className="object-cover rounded-md" 
                sizes="(max-width: 768px) 20vw, 10vw" 
              />
            ) : (
              <Puzzle className="w-1/2 h-1/2 text-muted-foreground/60" />
            )}
          </div>
        </div>
        <div className={cn(
            "card-face card-face-back border-2 shadow-lg transition-all",
            isMatched 
                ? "border-accent ring-2 ring-offset-2 ring-offset-background ring-accent shadow-xl shadow-accent/20" 
                : "border-primary",
            isFlipped && !isMatched && isBomb && "border-destructive animate-bomb-pulse"
        )}>
          {isImageType ? (
            <Image
              src={content}
              alt="Card content"
              fill
              data-ai-hint={hint}
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 20vw, 10vw"
            />
          ) : (
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">{content}</span>
          )}
        </div>
      </div>
    </div>
  );
}

    