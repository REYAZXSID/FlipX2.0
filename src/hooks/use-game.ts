"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  type GameSettings,
  type Card as CardType,
  createCardSet,
  GAME_STATUS,
} from '@/lib/game-constants';

type UseGameProps = {
  playFlipSound: () => void;
  playMatchSound: () => void;
  playWinSound: () => void;
};

export const useGame = ({ playFlipSound, playMatchSound, playWinSound }: UseGameProps) => {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isHintActive, setIsHintActive] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);

  const startGame = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    setCards(createCardSet(newSettings.gridSize, newSettings.theme));
    setStatus(GAME_STATUS.PLAYING);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTime(0);
    setHintsLeft(3);
  }, []);

  const restartGame = useCallback(() => {
    if (settings) {
      startGame(settings);
    }
  }, [settings, startGame]);

  const togglePause = useCallback(() => {
    if (status === 'playing') setStatus(GAME_STATUS.PAUSED);
    else if (status === 'paused') setStatus(GAME_STATUS.PLAYING);
  }, [status]);
  
  const canUseHint = useCallback(() => {
    return hintsLeft > 0 && status === 'playing';
  }, [hintsLeft, status]);

  const showHint = useCallback(() => {
    if (!canUseHint()) return;
    setIsHintActive(true);
    setHintsLeft(prev => prev - 1);
    setTimeout(() => setIsHintActive(false), 1500);
  }, [canUseHint]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'playing') {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const handleCardClick = useCallback((index: number) => {
    if (status !== 'playing' || !settings || flippedIndices.length >= 2 || flippedIndices.includes(index) || isHintActive) {
      return;
    }
    if(settings.sound) playFlipSound();
    setFlippedIndices((prev) => [...prev, index]);
  }, [status, flippedIndices, isHintActive, settings, playFlipSound]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      setMoves((prev) => prev + 1);

      if (firstCard.type === secondCard.type) {
        if(settings?.sound) setTimeout(() => playMatchSound(), 300);
        setMatchedPairs((prev) => [...prev, firstCard.type]);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards, settings, playMatchSound]);
  
  useEffect(() => {
    if (cards.length > 0 && matchedPairs.length === cards.length / 2) {
      setStatus(GAME_STATUS.FINISHED);
      if(settings?.sound) setTimeout(() => playWinSound(), 500);
    }
  }, [matchedPairs, cards, settings, playWinSound]);


  return {
    settings,
    status,
    cards,
    flippedIndices,
    matchedPairs,
    moves,
    time,
    isHintActive,
    hintsLeft,
    startGame,
    restartGame,
    togglePause,
    handleCardClick,
    showHint,
    canUseHint,
  };
};
