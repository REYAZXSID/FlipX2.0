
"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { StepHeader } from '@/components/layout/StepHeader';
import { SelectionCard } from '@/components/game/SelectionCard';
import { Square, LayoutGrid, Table2 } from 'lucide-react';
import { useSound } from '@/hooks/use-sound';
import { Footer } from '@/components/layout/Footer';

function GridSelectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playButtonSound } = useSound();

    const gameMode = searchParams.get('gameMode');

    if (!gameMode) {
        if (typeof window !== "undefined") router.replace('/');
        return null;
    }
    
    const handleSelectGrid = (gridSize: number) => {
        playButtonSound();
        const params = new URLSearchParams({ gameMode, gridSize: String(gridSize) });
        router.push(`/settings/theme?${params.toString()}`);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
                <Header />
                <main className="w-full flex flex-col items-center mt-8">
                    <StepHeader title="Select Grid" step={2} totalSteps={5} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-3xl">
                        <SelectionCard
                            Icon={Square}
                            title="2x2"
                            description="Easy (4 cards)"
                            onClick={() => handleSelectGrid(2)}
                        />
                        <SelectionCard
                            Icon={LayoutGrid}
                            title="4x4"
                            description="Medium (16 cards)"
                            onClick={() => handleSelectGrid(4)}
                        />
                        <SelectionCard
                            Icon={Table2}
                            title="6x6"
                            description="Hard (36 cards)"
                            onClick={() => handleSelectGrid(6)}
                        />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default function GridSelectionPageWrapper() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <GridSelectionPage />
        </Suspense>
    )
}
