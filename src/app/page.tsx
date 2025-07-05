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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSound } from '@/hooks/use-sound';

export default function Home() {
  const { playFlipSound, playMatchSound, playWinSound, playButtonSound } = useSound();
  const game = useGame({ playFlipSound, playMatchSound, playWinSound });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 relative">
      <OnboardingDialog />

      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold font-headline text-primary">Card Matcher</h1>
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

        <main>
          {game.status === 'idle' && (
            <Card className="w-full max-w-md mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Game Settings</CardTitle>
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
            </Card>
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
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center rounded-lg z-20">
                    <h2 className="text-4xl font-bold mb-4">Paused</h2>
                    <Button onClick={() => { playButtonSound(); game.togglePause(); }}>Resume Game</Button>
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
    </div>
  );
}
