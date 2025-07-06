
"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Header } from '@/components/layout/Header';
import { StepHeader } from '@/components/layout/StepHeader';
import { Button } from "@/components/ui/button";
import { DEFAULT_SETTINGS, LOCAL_STORAGE_KEYS } from "@/lib/game-constants";
import { SOUND_THEMES } from '@/lib/sound-themes';
import { Loader2, Music } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils";
import { SettingSelectionCard } from '@/components/game/SettingSelectionCard';
import { generateCards } from '@/ai/flows/generate-cards-flow';
import { useToast } from '@/hooks/use-toast';
import { setAICards } from '@/lib/ai-card-cache';
import { Footer } from '@/components/layout/Footer';

function SoundThemeSelectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { soundThemeInventory } = useUserData();

    const gameMode = searchParams.get('gameMode');
    const gridSize = searchParams.get('gridSize');
    const theme = searchParams.get('theme');
    const customTheme = searchParams.get('customTheme');
    const cardBack = searchParams.get('cardBack');

    const [selectedSoundTheme, setSelectedSoundTheme] = useState(DEFAULT_SETTINGS.soundTheme);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const saved = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        setSelectedSoundTheme(saved.soundTheme);
    }, []);

    useEffect(() => {
        if (!gameMode || !gridSize || !theme || !cardBack) {
            router.replace('/');
        }
    }, [gameMode, gridSize, theme, cardBack, router]);

    const handleStartGame = async () => {
        if (!gameMode || !gridSize || !theme || !cardBack) return;

        try {
            const currentSettings = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
            const fullSettings = { ...currentSettings, gameMode, gridSize: Number(gridSize), theme, customTheme: customTheme || '', cardBack, soundTheme: selectedSoundTheme };
            localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(fullSettings));
        } catch (error) {
           console.error("Could not save settings to localStorage", error);
        }

        const params = new URLSearchParams({
            gameMode,
            gridSize,
            theme,
            cardBack,
            soundTheme: selectedSoundTheme,
        });

        if (theme === 'ai-magic') {
            setIsGenerating(true);
            try {
                const numPairs = (Number(gridSize) * Number(gridSize)) / 2;
                const generatedPairs = await generateCards({ theme: customTheme!, numPairs });
                
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

    if (!gameMode || !gridSize || !theme || !cardBack) {
        return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
                <Header />
                <main className="w-full flex flex-col items-center mt-8">
                    <StepHeader title="Choose Sound" step={5} totalSteps={5} />
                    
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-4xl">
                        {SOUND_THEMES.map((soundTheme) => {
                            const isOwned = soundThemeInventory.includes(soundTheme.id);
                            return (
                               <SettingSelectionCard
                                    key={soundTheme.id}
                                    title={soundTheme.name}
                                    onClick={() => setSelectedSoundTheme(soundTheme.id)}
                                    isSelected={selectedSoundTheme === soundTheme.id}
                                    isOwned={isOwned}
                                >
                                    <Music className="w-16 h-16 text-primary" />
                               </SettingSelectionCard>
                            )
                        })}
                    </div>

                    <Button 
                        size="lg" 
                        className="mt-12 text-xl font-bold"
                        onClick={handleStartGame}
                        disabled={isGenerating}
                    >
                        {isGenerating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {isGenerating ? 'Generating...' : 'Start Game'}
                    </Button>
                </main>
            </div>
            <Footer />
        </div>
    );
}

const getInitialData = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

export default function SoundThemeSelectionPageWrapper() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <SoundThemeSelectionPage />
        </Suspense>
    )
}
