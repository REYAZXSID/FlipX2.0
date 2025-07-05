"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGame } from '@/hooks/use-game';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { GameStats } from '@/components/game/GameStats';
import { GameWonDialog } from '@/components/game/GameWonDialog';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/use-sound';
import { Sparkles, Loader2 } from 'lucide-react';
import { DEFAULT_SETTINGS, THEMES, GRID_SIZES } from '@/lib/game-constants';
import { Header } from '@/components/layout/Header';
import { ThemeToggle } from '@/components/ThemeToggle';

const LOCAL_STORAGE_KEY = 'card-matcher-settings';

function PlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { playFlipSound, playMatchSound, playWinSound, playButtonSound } = useSound();
  const game = useGame({ playFlipSound, playMatchSound, playWinSound });

  const [soundEnabled, setSoundEnabled] = useState(DEFAULT_SETTINGS.sound);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
        const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedSettings) {
            setSoundEnabled(JSON.parse(savedSettings).sound);
        }
    } catch (error) {
        console.error("Could not load sound settings", error);
    }

    const gridSize = Number(searchParams.get('gridSize'));
    const themeName = searchParams.get('theme');
    
    const isValidGrid = GRID_SIZES.some(s => s.value === gridSize);
    const isValidTheme = Object.keys(THEMES).includes(themeName || '');

    if (isValidGrid && isValidTheme) {
      game.startGame({
        gridSize,
        theme: themeName!,
        sound: soundEnabled
      });
      setIsLoading(false);
    } else {
      router.replace('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    try {
      const savedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({...savedSettings, sound: newSoundEnabled }));
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
      <div className="w-full max-w-7xl mx-auto">
        <Header />

        <main className="w-full max-w-4xl mx-auto mt-4">
          
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <GameStats
                    time={game.time}
                    moves={game.moves}
                    gridSize={game.settings.gridSize}
                />
                <div className="flex items-center gap-2">
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
                    <ThemeToggle />
                </div>
            </div>

            <div className="relative">
              <GameBoard
                cards={game.cards}
                flippedIndices={game.flippedIndices}
                matchedPairs={game.matchedPairs}
                onCardClick={game.handleCardClick}
                gridSize={game.settings.gridSize}
                isHintActive={game.isHintActive}
              />
              {game.status === 'paused' && (
                <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center rounded-lg z-20 backdrop-blur-sm">
                    <h2 className="text-5xl font-bold font-headline mb-6 text-primary">Paused</h2>
                    <Button size="lg" onClick={() => { playButtonSound(); game.togglePause(); }}>Resume Game</Button>
                </div>
              )}
            </div>
        </main>
      </div>

      <GameWonDialog
        isOpen={game.status === 'finished'}
        moves={game.moves}
        time={game.time}
        gridSize={game.settings.gridSize}
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
