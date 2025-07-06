
"use client";

import React, { useEffect, useState, Suspense, useMemo } from 'react';
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
import { Code, Loader2, Bomb, Shuffle } from 'lucide-react';
import { DEFAULT_SETTINGS, THEMES, GRID_SIZES, LOCAL_STORAGE_KEYS, CARD_BACKS } from '@/lib/game-constants';
import { Header } from '@/components/layout/Header';
import { getAICards } from '@/lib/ai-card-cache';
import { cn } from '@/lib/utils';

function PlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const userData = useUserData();
  const [isLoading, setIsLoading] = useState(true);

  const gridSize = Number(searchParams.get('gridSize'));
  const themeName = searchParams.get('theme');
  const gameMode = searchParams.get('gameMode');
  const cardBackId = searchParams.get('cardBack');
  const soundTheme = searchParams.get('soundTheme');

  const { playFlipSound, playMatchSound, playWinSound, playButtonSound } = useSound(soundTheme || 'default');
  const game = useGame({ playFlipSound, playMatchSound, playWinSound });

  const cardBackData = useMemo(() => {
    const allBacks = [...CARD_BACKS, ...userData.customCardBacks];
    return allBacks.find(cb => cb.id === cardBackId);
  }, [cardBackId, userData.customCardBacks]);

  const cardBackClass = cardBackData?.className ?? 'card-back-default';
  const customCardBackContent = (cardBackData && 'content' in cardBackData) ? cardBackData.content : undefined;
  const themeBackgroundClass = cardBackData?.themeBackgroundClass ?? 'theme-bg-default';


  const aiCards = useMemo(() => {
    if (themeName === 'ai-magic') {
      const cards = getAICards();
      if (cards && cards.length === gridSize * gridSize) {
        return cards;
      }
    }
    return null;
  }, [themeName, gridSize]);


  useEffect(() => {
    const savedSettings = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

    const isValidGrid = GRID_SIZES.some(s => s.value === gridSize);
    const isValidTheme = themeName ? Object.keys(THEMES).includes(themeName) : false;

    if (isValidGrid && isValidTheme && gameMode && cardBackId && soundTheme) {
       if (themeName === 'ai-magic' && !aiCards) {
        router.replace('/');
        return;
      }

      game.startGame({
        gridSize,
        theme: themeName!,
        gameMode,
        cardBack: cardBackId,
        soundTheme,
        sound: savedSettings.sound
      }, aiCards || undefined);
      setIsLoading(false);
    } else {
      router.replace('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiCards]);

  const toggleSound = () => {
    const newSoundEnabled = !game.settings?.sound;
    const savedSettings = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify({...savedSettings, sound: newSoundEnabled }));
    if (game.settings) {
      game.setSettings(prev => prev ? ({...prev, sound: newSoundEnabled}) : null);
    }
  };

  if (isLoading || !game.settings) {
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <GameStats
                    time={game.time}
                    moves={game.moves}
                    gridSize={game.settings.gridSize}
                    gameMode={game.settings.gameMode}
                />
                <GameControls
                    onRestart={() => { playButtonSound(); game.restartGame(); }}
                    onPause={game.togglePause}
                    isPaused={game.status === 'paused'}
                    toggleSound={toggleSound}
                    isSoundEnabled={game.settings.sound}
                    onShowHint={() => { playButtonSound(); game.showHint(); }}
                    hintsLeft={game.hintsLeft}
                    canUseHint={game.canUseHint()}
                />
            </div>

            <div className="relative">
              <GameBoard
                cards={game.cards}
                flippedIndices={game.flippedIndices}
                matchedPairs={game.matchedPairs}
                onCardClick={(i) => game.handleCardClick(i)}
                gridSize={game.settings.gridSize}
                isHintActive={game.isHintActive}
                isPeeking={game.isPeeking}
                isScrambling={game.isScrambling}
                cardBackClass={cardBackClass}
                customCardBackContent={customCardBackContent}
              />
              {game.bombTimer !== null && (
                <div className="absolute top-4 right-4 bg-destructive/90 text-destructive-foreground p-4 rounded-lg shadow-lg z-20 flex items-center gap-4 animate-pulse">
                    <Bomb className="w-8 h-8"/>
                    <div className="text-center">
                        <div className="text-4xl font-bold font-headline">{game.bombTimer}</div>
                    </div>
                </div>
              )}
              {game.status === 'paused' && (
                <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center rounded-lg z-20 backdrop-blur-sm">
                    <h2 className="text-5xl font-bold font-headline mb-6 text-primary">Paused</h2>
                    <Button size="lg" onClick={() => { playButtonSound(); game.togglePause(); }}>Resume Game</Button>
                </div>
              )}
               {game.isScrambling && (
                <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center rounded-lg z-20 backdrop-blur-sm">
                    <h2 className="text-5xl font-bold font-headline mb-6 text-primary animate-pulse">Scrambling!</h2>
                    <Shuffle className="w-12 h-12 text-primary animate-spin" />
                </div>
              )}
            </div>
            <PowerupToolbar 
                powerups={userData.powerups}
                onUsePowerup={(id) => {
                    if (userData.usePowerup(id)) {
                        playButtonSound();
                        if (id === 'autoMatch') game.useAutoMatch();
                        if (id === 'secondChance') game.setSecondChanceActive(true);
                        if (id === 'xrayVision') {
                            const firstUnflipped = game.cards.findIndex((c, i) => !game.matchedPairs.includes(c.type) && !game.flippedIndices.includes(i));
                            if (firstUnflipped !== -1) game.handleCardClick(firstUnflipped, true);
                        }
                    }
                }}
            />
        </main>
      </div>

      <GameWonDialog
        isOpen={game.status === 'finished'}
        moves={game.moves}
        time={game.time}
        gridSize={game.settings.gridSize}
        onPlayAgain={() => { playButtonSound(); game.restartGame(); }}
        onNewGame={() => { playButtonSound(); router.push('/'); }}
        isNewHighScore={game.isNewHighScore}
        unlockedAchievements={game.unlockedAchievements}
        coinsEarned={game.coinsEarned}
        gameMode={game.settings.gameMode}
      />
      <GameLostDialog
        isOpen={game.status === 'lost'}
        onPlayAgain={() => { playButtonSound(); game.restartGame(); }}
        onNewGame={() => { playButtonSound(); router.push('/'); }}
      />
      <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
        <p className="inline-flex items-center gap-2">
            Build by Sid <Code className="w-4 h-4 text-accent" />
        </p>
      </footer>
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
