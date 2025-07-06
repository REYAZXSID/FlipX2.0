
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
import { useUserData } from './use-user-data';

type UseGameProps = {
  playFlipSound: () => void;
  playMatchSound: () => void;
  playWinSound: () => void;
};

const calculateTimeLimit = (gridSize: number) => {
    switch (gridSize) {
        case 2: return 15; // 15 seconds
        case 4: return 90; // 1.5 minutes
        case 6: return 240; // 4 minutes
        default: return 90;
    }
}

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
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isSecondChanceActive, setSecondChanceActive] = useState(false);
  const { logGameWin } = useUserData();
  
  const startGame = useCallback((newSettings: GameSettings, customCards?: CardType[]) => {
    setSettings(newSettings);
    setStatus(GAME_STATUS.PLAYING);
    if (customCards) {
      setCards(customCards);
    } else {
      setCards(createCardSet(newSettings.gridSize, newSettings.theme));
    }
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTime(newSettings.gameMode === 'time-attack' ? calculateTimeLimit(newSettings.gridSize) : 0);
    setHintsLeft(3);
    setIsNewHighScore(false);
    setUnlockedAchievements([]);
    setCoinsEarned(0);
    setSecondChanceActive(false);
  }, []);

  const restartGame = useCallback(() => {
    if (settings) {
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
    if (status === 'playing' && settings) {
      timer = setInterval(() => {
        if (settings.gameMode === 'time-attack') {
            setTime(prevTime => {
                if (prevTime > 1) {
                    return prevTime - 1;
                }
                setStatus(GAME_STATUS.LOST);
                return 0;
            });
        } else {
            setTime(prevTime => prevTime + 1);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, settings]);

  const handleCardClick = useCallback((index: number, isXray: boolean = false) => {
    if (status !== 'playing' || !settings || flippedIndices.length >= 2 || flippedIndices.includes(index) || isHintActive) {
      return;
    }
    if (cards.length > 0 && matchedPairs.includes(cards[index].type)) {
      return;
    }
    
    if (settings.sound) playFlipSound();

    if (isXray) {
        setFlippedIndices([index]);
        setTimeout(() => setFlippedIndices([]), 1000);
        return;
    }
    
    setFlippedIndices(prev => [...prev, index]);
  }, [status, flippedIndices, isHintActive, settings, playFlipSound, cards, matchedPairs]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.type === secondCard.type) {
        if(settings?.sound) setTimeout(() => playMatchSound(), 300);
        setMatchedPairs(prev => [...prev, firstCard.type]);
        setFlippedIndices([]);
        if (isSecondChanceActive) setSecondChanceActive(false);
      } else {
        if (isSecondChanceActive) {
            setFlippedIndices([]);
            setSecondChanceActive(false);
        } else {
            setTimeout(() => setFlippedIndices([]), 1000);
        }
      }
    }
  }, [flippedIndices, cards, settings, playMatchSound, isSecondChanceActive]);
  
  const useAutoMatch = useCallback(() => {
    if (status !== 'playing') return;
    const unmatchedCards = cards
        .map((card, index) => ({...card, index}))
        .filter(card => !matchedPairs.includes(card.type));
    
    if (unmatchedCards.length < 2) return;

    const firstCard = unmatchedCards[0];
    const secondCard = unmatchedCards.find(c => c.type === firstCard.type && c.index !== firstCard.index);

    if (secondCard) {
        setFlippedIndices([firstCard.index, secondCard.index]);
        setMoves(prev => prev + 1);
        if(settings?.sound) setTimeout(() => playMatchSound(), 300);
        setMatchedPairs(prev => [...prev, firstCard.type]);
        setTimeout(() => setFlippedIndices([]), 500);
    }
  }, [cards, matchedPairs, status, settings, playMatchSound]);

  useEffect(() => {
    if (settings && cards.length > 0 && matchedPairs.length === cards.length / 2) {
      setStatus(GAME_STATUS.FINISHED);
      if(settings?.sound) setTimeout(() => playWinSound(), 500);

      // --- Achievement & Coin Logic ---
      let achievementCoins = 0;
      try {
        const existingAchievements: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS) || '[]');
        const isFirstWin = existingAchievements.length === 0;

        const justUnlocked = checkAchievements({ moves, time, gridSize: settings.gridSize, theme: settings.theme, gameMode: settings.gameMode, isFirstWin });
        const newAchievements = justUnlocked.filter(ach => !existingAchievements.includes(ach.id));

        if (newAchievements.length > 0) {
          achievementCoins = newAchievements.reduce((sum, ach) => sum + ach.reward, 0);
          const allUnlocked = [...existingAchievements, ...newAchievements.map(ach => ach.id)];
          localStorage.setItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(allUnlocked));
          setUnlockedAchievements(newAchievements);
        }
      } catch(e) { console.error("Failed to process achievements", e) }

      // --- Coin Calculation ---
      const baseCoins = settings.gridSize * 10;
      const movePenalty = Math.floor(moves / 5);
      const timePenalty = settings.gameMode === 'classic' ? Math.floor(time / 10) : 0;
      const gameWinCoins = Math.max(10, baseCoins - movePenalty - timePenalty);
      
      const totalEarned = gameWinCoins + achievementCoins;
      setCoinsEarned(totalEarned);

      // Log game win to update missions and central coin balance
      logGameWin({ coinsEarned: totalEarned, gridSize: settings.gridSize, moves, gameMode: settings.gameMode, theme: settings.theme });
      
      // --- High Score Logic ---
      try {
        const highScores: Record<string, HighScore> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.HIGH_SCORES) || '{}');
        const currentHighScore = highScores[settings.gridSize];
        if (!currentHighScore || moves < currentHighScore.moves || (moves === currentHighScore.moves && time < currentHighScore.time)) {
          highScores[settings.gridSize] = { moves, time };
          localStorage.setItem(LOCAL_STORAGE_KEYS.HIGH_SCORES, JSON.stringify(highScores));
          setIsNewHighScore(true);
        }
      } catch (e) { console.error("Failed to save high score", e) }

      // Notify other components that storage has changed
      window.dispatchEvent(new Event('storage'));
    }
  }, [matchedPairs, cards, settings, playWinSound, moves, time, logGameWin]);


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
    coinsEarned,
    startGame,
    restartGame,
    togglePause,
    handleCardClick,
    showHint,
    canUseHint,
    useAutoMatch,
    setSecondChanceActive,
    setSettings,
  };
};
