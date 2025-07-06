
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
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

type LostReason = 'time-up' | 'bomb' | 'mismatch';

const calculateTimeLimit = (gridSize: number) => {
    switch (gridSize) {
        case 2: return 15; // 15 seconds
        case 4: return 90; // 1.5 minutes
        case 6: return 240; // 4 minutes
        default: return 90;
    }
}

const BOMB_TIMER_SECONDS = 5;

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const useGame = ({ playFlipSound, playMatchSound, playWinSound }: UseGameProps) => {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [mismatchedIndices, setMismatchedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isHintActive, setIsHintActive] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isSecondChanceActive, setSecondChanceActive] = useState(false);
  const [bombTimer, setBombTimer] = useState<number | null>(null);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [scrambleTriggerMove, setScrambleTriggerMove] = useState(0);
  const [lostReason, setLostReason] = useState<LostReason | null>(null);
  const isProcessingFlip = useRef(false);


  const { logGameWin } = useUserData();
  
  const startGame = useCallback((newSettings: GameSettings, customCards?: CardType[]) => {
    setSettings(newSettings);
    setStatus(GAME_STATUS.PLAYING);
    if (customCards) {
      setCards(customCards);
    } else {
      setCards(createCardSet(newSettings.gridSize, newSettings.theme, newSettings.gameMode));
    }
    setFlippedIndices([]);
    setMismatchedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTime(newSettings.gameMode === 'time-attack' ? calculateTimeLimit(newSettings.gridSize) : 0);
    setHintsLeft(3);
    setIsNewHighScore(false);
    setUnlockedAchievements([]);
    setCoinsEarned(0);
    setSecondChanceActive(false);
    setBombTimer(null);
    setIsPeeking(false);
    setIsScrambling(false);
    setLostReason(null);
    isProcessingFlip.current = false;

    if (newSettings.gameMode === 'peekaboo') {
      setIsPeeking(true);
      const peekDuration = newSettings.gridSize === 2 ? 2000 : newSettings.gridSize === 4 ? 3500 : 5000;
      setTimeout(() => setIsPeeking(false), peekDuration);
    }
    if (newSettings.gameMode === 'scramble') {
      setScrambleTriggerMove(Math.floor(Math.random() * 5) + 8); // 8-12
    } else {
      setScrambleTriggerMove(0);
    }
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
                setLostReason('time-up');
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
    if (isProcessingFlip.current || status !== 'playing' || !settings || flippedIndices.length >= 2 || flippedIndices.includes(index) || isHintActive || isPeeking || isScrambling) {
      return;
    }
    if (cards.length > 0 && matchedPairs.includes(cards[index].type)) {
      return;
    }
    
    if (settings.sound) playFlipSound();

    const card = cards[index];
    if (settings.gameMode === 'minefield' && card.isBomb && flippedIndices.length === 0 && bombTimer === null) {
      setBombTimer(BOMB_TIMER_SECONDS);
    }

    if (isXray) {
        setFlippedIndices([index]);
        setTimeout(() => setFlippedIndices([]), 1000);
        return;
    }
    
    setFlippedIndices(prev => [...prev, index]);
  }, [status, flippedIndices, isHintActive, settings, playFlipSound, cards, matchedPairs, bombTimer, isPeeking, isScrambling]);

  const scrambleCards = useCallback((currentMoves: number) => {
    setIsScrambling(true);

    setTimeout(() => {
        const unmatchedCardData = cards
            .map((card, index) => ({ card, index }))
            .filter(({ card }) => !matchedPairs.includes(card.type));
        
        const cardObjectsToShuffle = unmatchedCardData.map(item => item.card);
        const shuffledObjects = shuffleArray(cardObjectsToShuffle);

        const newCards = [...cards];
        unmatchedCardData.forEach((item, i) => {
            newCards[item.index] = shuffledObjects[i];
        });

        setCards(newCards);
        setScrambleTriggerMove(currentMoves + Math.floor(Math.random() * 5) + 8); // Set next scramble
        setIsScrambling(false);
    }, 1000); // Animation duration
  }, [cards, matchedPairs]);


  // Effect for handling card flips and matches
  useEffect(() => {
    if (flippedIndices.length < 2 || isProcessingFlip.current) {
      return;
    }

    isProcessingFlip.current = true;
    setMoves(prevMoves => prevMoves + 1);
    
    const [firstIndex, secondIndex] = flippedIndices;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];
    const isMatch = firstCard.type === secondCard.type;

    if (isMatch) {
      if(settings?.sound) setTimeout(() => playMatchSound(), 300);
      if (firstCard.isBomb) {
        setBombTimer(null); // Defused!
      }
      setMatchedPairs(prev => [...prev, firstCard.type]);
      setFlippedIndices([]);
      if (isSecondChanceActive) setSecondChanceActive(false);
      isProcessingFlip.current = false;
    } else { // Mismatch logic
      setMismatchedIndices(flippedIndices);
      if (isSecondChanceActive) {
        setFlippedIndices([]);
        setMismatchedIndices([]);
        setSecondChanceActive(false);
        isProcessingFlip.current = false;
      } else if (settings?.gameMode === 'sudden-death') {
        setLostReason('mismatch');
        setTimeout(() => {
          setStatus(GAME_STATUS.LOST);
          isProcessingFlip.current = false;
        }, 1000);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setMismatchedIndices([]);
          isProcessingFlip.current = false;
        }, 1000);
      }
    }
  }, [flippedIndices, cards, settings, playMatchSound, isSecondChanceActive]);

  // Effect for Scramble mode, depends on moves
  useEffect(() => {
      if (settings?.gameMode !== 'scramble' || !scrambleTriggerMove || status !== 'playing') {
          return;
      }
      const isGameFinished = matchedPairs.length === cards.length / 2;
      if (moves > 0 && moves === scrambleTriggerMove && !isGameFinished) {
          scrambleCards(moves);
      }
  }, [moves, settings, scrambleTriggerMove, status, matchedPairs.length, cards.length, scrambleCards]);


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (bombTimer !== null && bombTimer > 0 && status === 'playing') {
      interval = setInterval(() => {
        setBombTimer(t => (t ? t - 1 : null));
      }, 1000);
    } else if (bombTimer === 0) {
      setLostReason('bomb');
      setStatus(GAME_STATUS.LOST);
    }
    return () => clearInterval(interval);
  }, [bombTimer, status]);
  
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
    }
  }, [cards, matchedPairs, status]);

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
    mismatchedIndices,
    moves,
    time,
    isHintActive,
    hintsLeft,
    isNewHighScore,
    unlockedAchievements,
    coinsEarned,
    bombTimer,
    isPeeking,
    isScrambling,
    lostReason,
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
