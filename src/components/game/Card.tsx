"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type CardProps = {
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  isImageType: boolean;
  hint?: string;
};

export function Card({ content, isFlipped, isMatched, onClick, isImageType, hint }: CardProps) {
  const handleCardClick = () => {
    if (isFlipped || isMatched) {
      return;
    }
    onClick();
  };

  const cardClasses = cn(
    'card rounded-lg',
    { 'is-flipped': isFlipped || isMatched },
    isMatched ? 'opacity-70' : 'cursor-pointer'
  );

  return (
    <div className="card-container aspect-square" onClick={handleCardClick}>
      <div className={cardClasses}>
        <div className="card-face card-face-front transition-colors p-2">
          <div className="w-full h-full rounded-md bg-primary/10 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full bg-primary/20" />
          </div>
        </div>
        <div className="card-face card-face-back border-2 border-primary shadow-lg">
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
