
"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Brain } from 'lucide-react';

type CardProps = {
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  isImageType: boolean;
  hint?: string;
  cardBackClass: string;
};

export function Card({ content, isFlipped, isMatched, onClick, isImageType, hint, cardBackClass }: CardProps) {
  const handleCardClick = () => {
    if (isFlipped || isMatched) {
      return;
    }
    onClick();
  };

  const cardClasses = cn(
    'card rounded-lg',
    { 'is-flipped': isFlipped || isMatched },
    isMatched ? 'cursor-not-allowed' : 'cursor-pointer'
  );

  return (
    <div className="card-container aspect-square" onClick={handleCardClick}>
      <div className={cardClasses}>
        <div className={cn("card-face card-face-front transition-colors p-2", cardBackClass)}>
          <div className="w-full h-full rounded-md flex items-center justify-center">
            <Brain className="w-1/2 h-1/2 text-primary-foreground/30" />
          </div>
        </div>
        <div className={cn(
            "card-face card-face-back border-2 shadow-lg transition-all",
            isMatched ? "border-accent ring-2 ring-offset-2 ring-offset-background ring-accent" : "border-primary"
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
