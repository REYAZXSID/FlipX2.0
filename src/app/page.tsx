"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsForm } from '@/components/game/SettingsForm';
import { OnboardingDialog } from '@/components/game/OnboardingDialog';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSound } from '@/hooks/use-sound';
import { Sparkles } from 'lucide-react';
import type { GameSettings } from '@/lib/game-constants';
import { DEFAULT_SETTINGS } from '@/lib/game-constants';
import { Header } from '@/components/layout/Header';

const LOCAL_STORAGE_KEY = 'card-matcher-settings';

export default function Home() {
  const router = useRouter();
  const { playButtonSound } = useSound();
  const [settings, setSettings] = useState<Omit<GameSettings, 'sound'>>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const { sound, ...gameSettings } = parsed;
        setSettings(gameSettings);
      }
    } catch (error) {
      console.error("Could not load settings from localStorage", error);
    }
  }, []);
  
  const handleStartGame = (newSettings: Omit<GameSettings, 'sound'>) => {
    playButtonSound();
    try {
      const currentSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const fullSettings = { ...currentSettings, ...newSettings };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fullSettings));
    } catch (error) {
       console.error("Could not save settings to localStorage", error);
    }
    const params = new URLSearchParams({
      gridSize: String(newSettings.gridSize),
      theme: newSettings.theme,
    });
    router.push(`/play?${params.toString()}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-2 sm:p-4">
      <OnboardingDialog />
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-md mx-auto mt-8">
            <UICard className="w-full shadow-xl border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-headline tracking-wide">Game Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <SettingsForm
                  onStartGame={handleStartGame}
                  defaultValues={settings}
                />
              </CardContent>
            </UICard>
        </main>
      </div>

      <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
        <a href="https://firebase.google.com/docs/studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
            Powered by Firebase Studio <Sparkles className="w-4 h-4 text-accent" />
        </a>
      </footer>
    </div>
  );
}
