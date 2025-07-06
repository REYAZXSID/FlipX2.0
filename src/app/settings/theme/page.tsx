
"use client";

import React, { useState, Suspense, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { StepHeader } from '@/components/layout/StepHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { THEMES, DEFAULT_SETTINGS, LOCAL_STORAGE_KEYS } from "@/lib/game-constants";
import { Code, Smile, Globe, CaseSensitive, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingSelectionCard } from '@/components/game/SettingSelectionCard';
import { Footer } from '@/components/layout/Footer';

function ThemeSelectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const gameMode = searchParams.get('gameMode');
    const gridSize = searchParams.get('gridSize');

    const [selectedTheme, setSelectedTheme] = useState(DEFAULT_SETTINGS.theme);
    const [customTheme, setCustomTheme] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const saved = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        setSelectedTheme(saved.theme);
        setCustomTheme(saved.customTheme || '');
    }, []);

    useEffect(() => {
        if (!gameMode || !gridSize) {
            router.replace('/');
        }
    }, [gameMode, gridSize, router]);

    const isNextDisabled = useMemo(() => {
        return isSubmitting || (selectedTheme === 'ai-magic' && customTheme.length < 3);
    }, [isSubmitting, selectedTheme, customTheme]);
    
    const handleNext = () => {
        if (isNextDisabled) return;
        setIsSubmitting(true);

        const params = new URLSearchParams({
            gameMode: gameMode!,
            gridSize: gridSize!,
            theme: selectedTheme,
        });

        if (selectedTheme === 'ai-magic') {
            params.set('customTheme', customTheme);
        }
        
        router.push(`/settings/card-back?${params.toString()}`);
    };

    if (!gameMode || !gridSize) {
        return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center flex-grow px-4">
                <Header />
                <main className="w-full flex flex-col items-center mt-8">
                    <StepHeader title="Select Theme" step={3} totalSteps={5} />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
                        {Object.values(THEMES).map((theme) => {
                            let Icon;
                            switch(theme.name) {
                                case 'emojis': Icon = Smile; break;
                                case 'flags': Icon = Globe; break;
                                case 'letters': Icon = CaseSensitive; break;
                                case 'ai-magic': Icon = Code; break;
                                default: Icon = Smile;
                            }
                            return (
                               <SettingSelectionCard
                                    key={theme.name}
                                    title={theme.label}
                                    onClick={() => setSelectedTheme(theme.name)}
                                    isSelected={selectedTheme === theme.name}
                                    isOwned={true}
                                >
                                    <Icon className="w-16 h-16 text-primary" />
                               </SettingSelectionCard>
                            )
                        })}
                    </div>

                    {selectedTheme === 'ai-magic' && (
                        <div className="w-full max-w-md mt-8 space-y-2 animate-fly-in">
                            <h3 className="text-center font-semibold text-lg">Describe Your AI Theme</h3>
                            <Input 
                                placeholder="e.g. 'Cute Dinosaurs' or 'Vintage Cars'" 
                                value={customTheme}
                                onChange={(e) => setCustomTheme(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground text-center">
                                Please enter a theme with at least 3 characters.
                            </p>
                        </div>
                    )}

                    <Button 
                        size="lg" 
                        className="mt-12 text-xl font-bold"
                        onClick={handleNext}
                        disabled={isNextDisabled}
                    >
                        Next <ArrowRight className="ml-2 h-5 w-5" />
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

export default function ThemeSelectionPageWrapper() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ThemeSelectionPage />
        </Suspense>
    )
}
