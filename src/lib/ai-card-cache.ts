'use client';

import type { Card } from './game-constants';

let aiCards: Card[] | null = null;

export const setAICards = (cards: Card[]): void => {
  aiCards = cards;
};

export const getAICards = (): Card[] | null => {
  const cards = aiCards;
  aiCards = null; 
  return cards;
};
