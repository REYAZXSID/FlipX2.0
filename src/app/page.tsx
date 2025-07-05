"use client";

import React from 'react';
import { useGame } from '@/hooks/use-game';
import { SettingsForm } from '@/components/game/SettingsForm';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { GameStats } from '@/components/game/GameStats';
import { GameWonDialog } from '@/components/game/GameWonDialog';
import { OnboardingDialog } from '@/components/game/OnboardingDialog';
import { Button } from '@/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSound } from '@/hooks/use-sound';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const { playFlipSound, playMatchSound, playWinSound, playButtonSound } = useSound();
  const game = useGame({ playFlipSound, playMatchSound, playWinSound });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-2 sm:p-4">
      <OnboardingDialog />

      <div className="w-full max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4 p-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-wider">
            Card Matcher
          </h1>
          {game.status !== 'idle' && (
            <GameControls
              onRestart={() => { playButtonSound(); game.restartGame(); }}
              onPause={game.togglePause}
              isPaused={game.status === 'paused'}
              toggleSound={game.toggleSound}
              isSoundEnabled={game.settings.sound}
              toggleTheme={game.toggleTheme}
              theme={game.theme}
              onShowHint={() => { playButtonSound(); game.showHint(); }}
              hintsLeft={game.hintsLeft}
              canUseHint={game.canUseHint()}
            />
          )}
        </header>

        <main className="w-full max-w-3xl mx-auto">
          {game.status === 'idle' && (
            <UICard className="w-full max-w-md mx-auto shadow-xl border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-headline tracking-wide">Game Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <SettingsForm
                  onStartGame={(settings) => {
                    playButtonSound();
                    game.startGame(settings);
                  }}
                  defaultValues={game.settings}
                />
              </CardContent>
            </UICard>
          )}

          {(game.status === 'playing' || game.status === 'paused') && (
            <div className="relative">
              <GameStats
                time={game.time}
                moves={game.moves}
                gridSize={game.settings.gridSize}
              />
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
          )}
        </main>
      </div>

      <GameWonDialog
        isOpen={game.status === 'finished'}
        moves={game.moves}
        time={game.time}
        gridSize={game.settings.gridSize}
        onPlayAgain={() => { playButtonSound(); game.restartGame(); }}
        onNewGame={() => { playButtonSound(); game.resetGame(); }}
      />

      <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
        <a href="https://firebase.google.com/docs/studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
            Powered by Firebase Studio <Sparkles className="w-4 h-4 text-accent" />
        </a>
      </footer>
    </div>
  );
}
