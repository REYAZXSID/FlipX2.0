
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsForm } from '@/components/game/SettingsForm';
import { OnboardingDialog } from '@/components/game/OnboardingDialog';
import { useSound } from '@/hooks/use-sound';
import { Sparkles } from 'lucide-react';
import type { GameSettings } from '@/lib/game-constants';
import { DEFAULT_SETTINGS, LOCAL_STORAGE_KEYS } from '@/lib/game-constants';
import { Header } from '@/components/layout/Header';
import { generateCards } from '@/ai/flows/generate-cards-flow';
import { useToast } from '@/hooks/use-toast';
import { setAICards } from '@/lib/ai-card-cache';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const { playButtonSound } = useSound();
  const [settings, setSettings] = useState<Omit<GameSettings, 'sound'>>(DEFAULT_SETTINGS);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const { sound, ...gameSettings } = parsed;
        setSettings(gameSettings);
      }
    } catch (error) {
      console.error("Could not load settings from localStorage", error);
    }
  }, []);
  
  const handleStartGame = async (newSettings: Omit<GameSettings, 'sound'>) => {
    playButtonSound();
    
    try {
      const currentSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS) || '{}');
      const fullSettings = { ...currentSettings, ...newSettings };
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(fullSettings));
    } catch (error) {
       console.error("Could not save settings to localStorage", error);
    }

    const params = new URLSearchParams({
      gridSize: String(newSettings.gridSize),
      theme: newSettings.theme,
      gameMode: newSettings.gameMode,
      cardBack: newSettings.cardBack,
    });

    if (newSettings.theme === 'ai-magic') {
      setIsGenerating(true);
      try {
        const numPairs = (newSettings.gridSize * newSettings.gridSize) / 2;
        const generatedPairs = await generateCards({ theme: newSettings.customTheme!, numPairs });
        
        const fullCardSet = [...generatedPairs, ...generatedPairs].sort(() => Math.random() - 0.5);
        
        setAICards(fullCardSet);

      } catch (err) {
        console.error("AI card generation failed", err);
        toast({
          variant: "destructive",
          title: "AI Generation Failed",
          description: "Could not generate cards for that theme. Please try another one.",
        });
        setIsGenerating(false);
        return;
      }
      setIsGenerating(false);
    }
    
    router.push(`/play?${params.toString()}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-2 sm:p-4">
      <OnboardingDialog />
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full flex justify-center mt-8">
            <SettingsForm
              onStartGame={handleStartGame}
              defaultValues={settings}
              isGenerating={isGenerating}
            />
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
