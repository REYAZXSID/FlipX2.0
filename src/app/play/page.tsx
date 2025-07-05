
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
import { Sparkles, Loader2 } from 'lucide-react';
import { DEFAULT_SETTINGS, THEMES, GRID_SIZES, LOCAL_STORAGE_KEYS, CARD_BACKS } from '@/lib/game-constants';
import { Header } from '@/components/layout/Header';
import { getAICards } from '@/lib/ai-card-cache';

function PlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { playFlipSound, playMatchSound, playWinSound, playButtonSound } = useSound();
  const game = useGame({ playFlipSound, playMatchSound, playWinSound });
  const userData = useUserData();

  const [soundEnabled, setSoundEnabled] = useState(DEFAULT_SETTINGS.sound);
  const [isLoading, setIsLoading] = useState(true);

  const gridSize = Number(searchParams.get('gridSize'));
  const themeName = searchParams.get('theme');
  const gameMode = searchParams.get('gameMode');
  const cardBack = searchParams.get('cardBack');
  const cardBackClass = CARD_BACKS.find(cb => cb.id === cardBack)?.className || 'card-back-default';

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
    try {
        const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
        if (savedSettings) {
            setSoundEnabled(JSON.parse(savedSettings).sound);
        }
    } catch (error) {
        console.error("Could not load sound settings", error);
    }
    
    const isValidGrid = GRID_SIZES.some(s => s.value === gridSize);
    const isValidTheme = themeName ? Object.keys(THEMES).includes(themeName) : false;

    if (isValidGrid && isValidTheme && gameMode && cardBack) {
       if (themeName === 'ai-magic' && !aiCards) {
        router.replace('/');
        return;
      }

      game.startGame({
        gridSize,
        theme: themeName!,
        sound: soundEnabled,
        gameMode,
        cardBack
      }, aiCards || undefined);
      setIsLoading(false);
    } else {
      router.replace('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiCards]);

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    try {
      const savedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS) || '{}');
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify({...savedSettings, sound: newSoundEnabled }));
      if (game.settings) {
        game.settings.sound = newSoundEnabled;
      }
    } catch (error) {
        console.error("Could not save sound settings", error);
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
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
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
                    isSoundEnabled={soundEnabled}
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
                cardBackClass={cardBackClass}
              />
              {game.status === 'paused' && (
                <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center rounded-lg z-20 backdrop-blur-sm">
                    <h2 className="text-5xl font-bold font-headline mb-6 text-primary">Paused</h2>
                    <Button size="lg" onClick={() => { playButtonSound(); game.togglePause(); }}>Resume Game</Button>
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
        <a href="https://firebase.google.com/docs/studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
            Powered by Firebase Studio <Sparkles className="w-4 h-4 text-accent" />
        </a>
      </footer>
    </div>
  );
}

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
