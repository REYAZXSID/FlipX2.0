"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  type GameSettings,
  type Card as CardType,
  createCardSet,
  GAME_STATUS,
  LOCAL_STORAGE_KEYS,
  type HighScore,
} from '@/lib/game-constants';
import { checkAchievements, type Achievement } from '@/lib/achievements';

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
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);

  const startGame = useCallback((newSettings: GameSettings, customCards?: CardType[]) => {
    setSettings(newSettings);
    if (customCards) {
      setCards(customCards);
    } else {
      setCards(createCardSet(newSettings.gridSize, newSettings.theme));
    }
    setStatus(GAME_STATUS.PLAYING);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTime(0);
    setHintsLeft(3);
    setIsNewHighScore(false);
    setUnlockedAchievements([]);
  }, []);

  const restartGame = useCallback(() => {
    if (settings) {
       // For AI games, restarting means going back to settings as cards are not preserved
      if (settings.theme === 'ai-magic') {
          window.location.href = '/';
      } else {
        startGame(settings);
      }
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
    if (cards.length > 0 && matchedPairs.includes(cards[index].type)) {
      return;
    }
    if(settings.sound) playFlipSound();
    setFlippedIndices((prev) => [...prev, index]);
  }, [status, flippedIndices, isHintActive, settings, playFlipSound, cards, matchedPairs]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

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

      // Check for High Scores
      try {
        const highScores: Record<string, HighScore> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.HIGH_SCORES) || '{}');
        const currentHighScore = highScores[settings!.gridSize];
        if (!currentHighScore || moves < currentHighScore.moves || (moves === currentHighScore.moves && time < currentHighScore.time)) {
          highScores[settings!.gridSize] = { moves, time };
          localStorage.setItem(LOCAL_STORAGE_KEYS.HIGH_SCORES, JSON.stringify(highScores));
          setIsNewHighScore(true);
          window.dispatchEvent(new Event('storage')); // Notify other components
        }
      } catch (e) { console.error("Failed to save high score", e) }

      // Check for Achievements
      try {
        const existingAchievements: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS) || '[]');
        const isFirstWin = existingAchievements.length === 0;

        const justUnlocked = checkAchievements({ moves, time, gridSize: settings!.gridSize, theme: settings!.theme, isFirstWin });
        const newAchievements = justUnlocked.filter(ach => !existingAchievements.includes(ach.id));

        if (newAchievements.length > 0) {
          const allUnlocked = [...existingAchievements, ...newAchievements.map(ach => ach.id)];
          localStorage.setItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(allUnlocked));
          setUnlockedAchievements(newAchievements);
          window.dispatchEvent(new Event('storage')); // Notify other components
        }
      } catch(e) { console.error("Failed to save achievements", e) }
    }
  }, [matchedPairs, cards, settings, playWinSound, moves, time]);


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
    isNewHighScore,
    unlockedAchievements,
    startGame,
    restartGame,
    togglePause,
    handleCardClick,
    showHint,
    canUseHint,
  };
};
