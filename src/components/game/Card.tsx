"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Diamond } from 'lucide-react';

type CardProps = {
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  isImageType: boolean;
};

export function Card({ content, isFlipped, isMatched, onClick, isImageType }: CardProps) {
  const handleCardClick = () => {
    if (!isFlipped && !isMatched) {
      onClick();
    }
  };

  const cardClasses = cn(
    'card cursor-pointer',
    { 'is-flipped': isFlipped || isMatched }
  );

  return (
    <div className="card-container aspect-square" onClick={handleCardClick}>
      <div className={cardClasses}>
        <div className="card-face card-face-front transition-colors">
          <Diamond className="w-1/2 h-1/2 text-primary/20" />
        </div>
        <div className="card-face card-face-back border-2 border-primary">
          {isImageType ? (
            <Image
              src={content}
              alt="Card content"
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 20vw, 10vw"
            />
          ) : (
            <span className="text-4xl md:text-5xl lg:text-6xl">{content}</span>
          )}
        </div>
      </div>
    </div>
  );
}
