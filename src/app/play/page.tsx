
"use client";

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGame } from '@/hooks/use-game';
import { useUserData } from '@/hooks/use-user-data';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { GameStats } from '@/components/game/GameStats';
import { GameWonDialog } from '@/components/game/GameWonDialog';
import { GameLostDialog } from '@/components/game/GameLostDialog';
import { PowerupToolbar } from '@/components/game/PowerupToolbar';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/use-sound';
import { Loader2, Bomb, Shuffle } from 'lucide-react';
import { DEFAULT_SETTINGS, THEMES, GRID_SIZES, LOCAL_STORAGE_KEYS, CARD_BACKS, type Card as CardType } from '@/lib/game-constants';
import { Header } from '@/components/layout/Header';
import { getAICards } from '@/lib/ai-card-cache';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/Footer';

function PlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);
  
  const userData = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  
  const gridSizeParam = searchParams.get('gridSize');
  const themeNameParam = searchParams.get('theme');
  const gameModeParam = searchParams.get('gameMode');
  const cardBackParam = searchParams.get('cardBack');
  const soundThemeParam = searchParams.get('soundTheme');
  
  const { playFlipSound, playMatchSound, playWinSound, playButtonSound } = useSound(soundThemeParam || 'default');
  
  const {
      startGame,
      restartGame,
      togglePause,
      handleCardClick,
      showHint,
      canUseHint,
      useAutoMatch,
      setSecondChanceActive,
      setSettings,
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
  } = useGame({ playFlipSound, playMatchSound, playWinSound });

  const cardBackData = React.useMemo(() => {
    if (!settings?.cardBack) return null;
    const allBacks = [...CARD_BACKS, ...userData.customCardBacks];
    return allBacks.find(cb => cb.id === settings.cardBack);
  }, [settings?.cardBack, userData.customCardBacks]);

  const cardBackClass = cardBackData?.className ?? 'card-back-default';
  const customCardBackContent = (cardBackData && 'content' in cardBackData) ? cardBackData.content : undefined;
  const themeBackgroundClass = cardBackData?.themeBackgroundClass ?? 'theme-bg-default';

  useEffect(() => {
    if (hasInitialized.current) return;

    const gridSize = gridSizeParam ? Number(gridSizeParam) : null;
    const themeName = themeNameParam;
    const gameMode = gameModeParam;
    const cardBack = cardBackParam;
    const soundTheme = soundThemeParam;
  
    const savedSettings = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

    const isValidGrid = gridSize ? GRID_SIZES.some(s => s.value === gridSize) : false;
    const isValidTheme = themeName ? Object.keys(THEMES).includes(themeName) : false;

    if (!gridSize || !isValidGrid || !isValidTheme || !gameMode || !cardBack || !soundTheme) {
      router.replace('/');
      return;
    }
    
    let initialCards: CardType[] | undefined;
    if (themeName === 'ai-magic') {
        const aiCards = getAICards();
        if (!aiCards || aiCards.length !== gridSize * gridSize) {
            router.replace('/');
            return;
        }
        initialCards = aiCards;
    }
    
    startGame({
        gridSize,
        theme: themeName,
        gameMode,
        cardBack: cardBack,
        soundTheme: soundTheme,
        sound: savedSettings.sound
    }, initialCards);
    setIsLoading(false);
    hasInitialized.current = true;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSizeParam, themeNameParam, gameModeParam, cardBackParam, soundThemeParam, router, startGame]);

  const toggleSound = () => {
    const newSoundEnabled = !settings?.sound;
    const savedSettings = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify({...savedSettings, sound: newSoundEnabled }));
    if (settings) {
      setSettings(prev => prev ? ({...prev, sound: newSoundEnabled}) : null);
    }
  };

  if (isLoading || !settings) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Setting up your game...</p>
        </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center min-h-screen bg-background p-2 sm:p-4", themeBackgroundClass)}>
      <div className="w-full max-w-7xl mx-auto px-4">
        <Header />
        <main className="w-full max-w-4xl mx-auto mt-4">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
                <GameStats
                    time={time}
                    moves={moves}
                    gridSize={settings.gridSize}
                    gameMode={settings.gameMode}
                />
            </div>

            <div className="relative">
              <GameBoard
                cards={cards}
                flippedIndices={flippedIndices}
                matchedPairs={matchedPairs}
                mismatchedIndices={mismatchedIndices}
                onCardClick={(i) => handleCardClick(i)}
                gridSize={settings.gridSize}
                isHintActive={isHintActive}
                isPeeking={isPeeking}
                isScrambling={isScrambling}
                cardBackClass={cardBackClass}
                customCardBackContent={customCardBackContent}
              />
              {bombTimer !== null && (
                <div className="absolute top-4 right-4 bg-destructive/90 text-destructive-foreground p-4 rounded-lg shadow-lg z-20 flex items-center gap-4 animate-pulse">
                    <Bomb className="w-8 h-8"/>
                    <div className="text-center">
                        <div className="text-4xl font-bold font-headline">{bombTimer}</div>
                    </div>
                </div>
              )}
              {status === 'paused' && (
                <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center rounded-lg z-20 backdrop-blur-sm">
                    <h2 className="text-5xl font-bold font-headline mb-6 text-primary">Paused</h2>
                    <Button size="lg" onClick={() => { playButtonSound(); togglePause(); }}>Resume Game</Button>
                </div>
              )}
               {isScrambling && (
                <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center rounded-lg z-20 backdrop-blur-sm">
                    <h2 className="text-5xl font-bold font-headline mb-6 text-primary animate-pulse">Scrambling!</h2>
                    <Shuffle className="w-12 h-12 text-primary animate-spin" />
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-center">
                <GameControls
                    onRestart={() => { playButtonSound(); restartGame(); }}
                    onPause={togglePause}
                    isPaused={status === 'paused'}
                    toggleSound={toggleSound}
                    isSoundEnabled={settings.sound}
                    onShowHint={() => { playButtonSound(); showHint(); }}
                    hintsLeft={hintsLeft}
                    canUseHint={canUseHint()}
                />
            </div>
            
            <PowerupToolbar 
                powerups={userData.powerups}
                onUsePowerup={(id) => {
                    if (userData.usePowerup(id)) {
                        playButtonSound();
                        if (id === 'autoMatch') useAutoMatch();
                        if (id === 'secondChance') setSecondChanceActive(true);
                        if (id === 'xrayVision') {
                            const firstUnflipped = cards.findIndex((c, i) => !matchedPairs.includes(c.type) && !flippedIndices.includes(i));
                            if (firstUnflipped !== -1) handleCardClick(firstUnflipped, true);
                        }
                    }
                }}
            />
        </main>
      </div>

      <GameWonDialog
        isOpen={status === 'finished'}
        moves={moves}
        time={time}
        gridSize={settings.gridSize}
        onPlayAgain={() => { playButtonSound(); restartGame(); }}
        onNewGame={() => { playButtonSound(); router.push('/'); }}
        isNewHighScore={isNewHighScore}
        unlockedAchievements={unlockedAchievements}
        coinsEarned={coinsEarned}
        gameMode={settings.gameMode}
      />
      <GameLostDialog
        isOpen={status === 'lost'}
        onPlayAgain={() => { playButtonSound(); restartGame(); }}
        onNewGame={() => { playButtonSound(); router.push('/'); }}
        reason={lostReason}
      />
      <Footer />
    </div>
  );
}

const getInitialData = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

export default function PlayPageWrapper() {
  return (
    <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
    }>
        <PlayPage />
    </Suspense>
  )
}
