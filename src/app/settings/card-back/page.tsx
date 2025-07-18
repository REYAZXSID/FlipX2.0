
"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import { Header } from '@/components/layout/Header';
import { StepHeader } from '@/components/layout/StepHeader';
import { Button } from "@/components/ui/button";
import { CARD_BACKS, DEFAULT_SETTINGS, LOCAL_STORAGE_KEYS } from "@/lib/game-constants";
import { ArrowRight } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils";
import { SettingSelectionCard } from '@/components/game/SettingSelectionCard';
import { Footer } from '@/components/layout/Footer';

function CardBackSelectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { inventory, customCardBacks } = useUserData();

    const gameMode = searchParams.get('gameMode');
    const gridSize = searchParams.get('gridSize');
    const theme = searchParams.get('theme');
    const customTheme = searchParams.get('customTheme');

    const [selectedCardBack, setSelectedCardBack] = useState(DEFAULT_SETTINGS.cardBack);

    useEffect(() => {
        const saved = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        setSelectedCardBack(saved.cardBack);
    }, []);

    useEffect(() => {
        if (!gameMode || !gridSize || !theme) {
            router.replace('/');
        }
    }, [gameMode, gridSize, theme, router]);

    const handleNext = () => {
        const params = new URLSearchParams({
            gameMode: gameMode!,
            gridSize: gridSize!,
            theme: theme!,
            cardBack: selectedCardBack,
        });

        if (customTheme) {
            params.set('customTheme', customTheme);
        }
        
        router.push(`/settings/sound-theme?${params.toString()}`);
    };

    if (!gameMode || !gridSize || !theme) {
        return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
    }

    const purchasedStandardBacks = CARD_BACKS.filter(back => inventory.includes(back.id));
    const availableCardBacks = [...purchasedStandardBacks, ...customCardBacks].sort((a,b) => (a.cost > b.cost ? 1 : -1));

    return (
        <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center flex-grow px-4">
                <Header />
                <main className="w-full flex flex-col items-center mt-8">
                    <StepHeader title="Select Card" step={4} totalSteps={5} />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
                        {availableCardBacks.map((back) => {
                            return (
                               <SettingSelectionCard
                                    key={back.id}
                                    title={back.name}
                                    onClick={() => setSelectedCardBack(back.id)}
                                    isSelected={selectedCardBack === back.id}
                                    isOwned={true}
                                >
                                    <div className={cn("w-3/4 h-full rounded-md relative shadow-lg", back.className)}>
                                      {'content' in back && back.content && <Image src={back.content} alt={back.name} fill className="object-cover rounded-md" />}
                                    </div>
                               </SettingSelectionCard>
                            )
                        })}
                    </div>

                    <Button size="lg" className="mt-12 text-xl font-bold" onClick={handleNext}>
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


export default function CardBackSelectionPageWrapper() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <CardBackSelectionPage />
        </Suspense>
    )
}
