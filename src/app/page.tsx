"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsForm } from '@/components/game/SettingsForm';
import { OnboardingDialog } from '@/components/game/OnboardingDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSound } from '@/hooks/use-sound';
import { Sparkles, Loader2, Trophy } from 'lucide-react';
import type { GameSettings } from '@/lib/game-constants';
import { DEFAULT_SETTINGS, LOCAL_STORAGE_KEYS } from '@/lib/game-constants';
import { Header } from '@/components/layout/Header';
import { generateCards, type GenerateCardsOutput } from '@/ai/flows/generate-cards-flow';
import { useToast } from '@/hooks/use-toast';
import { HighScores } from '@/components/game/HighScores';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
    });

    if (newSettings.theme === 'ai-magic') {
      setIsGenerating(true);
      try {
        const numPairs = (newSettings.gridSize * newSettings.gridSize) / 2;
        const generatedPairs = await generateCards({ theme: newSettings.customTheme!, numPairs });
        
        const fullCardSet = [...generatedPairs, ...generatedPairs].sort(() => Math.random() - 0.5);
        
        localStorage.setItem(LOCAL_STORAGE_KEYS.AI_CARDS, JSON.stringify(fullCardSet));

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
        <main className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card className="shadow-xl border-2 border-primary/20 row-start-1 lg:row-auto">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-headline tracking-wide">Game Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <SettingsForm
                  onStartGame={handleStartGame}
                  defaultValues={settings}
                  isGenerating={isGenerating}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-8">
              <HighScores />
              <Card className="shadow-lg border-border/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-headline tracking-wide">
                      <Trophy className="w-8 h-8 text-yellow-500" />
                      Achievements
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Track your progress and unlock badges for your accomplishments!</p>
                    <Link href="/achievements" passHref>
                        <Button className="w-full" variant="outline">View Achievements</Button>
                    </Link>
                </CardContent>
              </Card>
            </div>
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