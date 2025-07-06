"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, CircleDollarSign, Loader2, Wand2, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/use-user-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateCardBack } from '@/ai/flows/generate-card-back-flow';
import Image from 'next/image';
import type { CustomCardBack } from '@/lib/game-constants';
import { Footer } from '@/components/layout/Footer';

const AI_CARD_BACK_COST = 250;

export default function AICardBacksShopPage() {
    const { coins, purchaseItem } = useUserData();
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (prompt.length < 5) {
            toast({ variant: 'destructive', title: 'Prompt too short', description: 'Please enter a more descriptive prompt.' });
            return;
        }
        setIsLoading(true);
        setGeneratedImage(null);
        try {
            const result = await generateCardBack({ prompt });
            setGeneratedImage(result.content);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({ 
                variant: 'destructive', 
                title: 'Generation Failed', 
                description: `The AI could not create an image. Please try a different prompt. (Reason: ${errorMessage})` 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurchase = () => {
        if (!generatedImage) return;

        const newId = `ai_${Date.now()}`;
        const newCardBack: CustomCardBack = {
            id: newId,
            name: prompt,
            cost: AI_CARD_BACK_COST,
            content: generatedImage,
            type: 'ai-premium',
            className: newId, // Assign a unique className, can be same as id
        };

        const success = purchaseItem(newCardBack);

        if (success) {
            setGeneratedImage(null);
            setPrompt('');
            toast({ title: 'AI Card Back Purchased!', description: 'You can now use your new design in-game.' });
        }
    }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center flex-grow px-4">
        <Header />
        <main className="w-full max-w-2xl mx-auto mt-8">
            <div className="flex justify-between items-center w-full mb-6">
                <Button asChild variant="outline">
                    <Link href="/shop">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shop
                    </Link>
                </Button>
                <div className="inline-flex items-center justify-center gap-2 text-lg font-bold bg-amber-400/10 text-amber-500 p-3 rounded-lg border border-amber-500/20">
                    <CircleDollarSign className="w-6 h-6"/>
                    <span>{coins}</span>
                </div>
            </div>
            
             <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold font-headline tracking-wide text-primary">AI Card Back Generator</h1>
                <p className="text-muted-foreground mt-2">Create your own unique card back designs using AI!</p>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>1. Describe Your Design</CardTitle>
                    <CardDescription>Enter a prompt for the AI to generate your card back.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g., A cute baby dragon sleeping on a moon"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button onClick={handleGenerate} disabled={isLoading || prompt.length < 5}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wand2 className="w-4 h-4"/>}
                            <span className="ml-2 hidden sm:inline">Generate</span>
                        </Button>
                    </div>
                </CardContent>
                <CardHeader>
                    <CardTitle>2. Preview & Purchase</CardTitle>
                    <CardDescription>Your generated design will appear below.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[220px] bg-muted/50 rounded-lg">
                    {isLoading && <Loader2 className="w-12 h-12 text-primary animate-spin" />}
                    {!isLoading && generatedImage && (
                        <Image src={generatedImage} alt="Generated card back" width={200} height={200} className="rounded-lg shadow-lg border-4 border-card" />
                    )}
                    {!isLoading && !generatedImage && (
                        <p className="text-muted-foreground">Your image will be shown here</p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full font-bold text-lg h-12 mt-4" 
                        onClick={handlePurchase} 
                        disabled={!generatedImage || coins < AI_CARD_BACK_COST}
                    >
                        <Download className="mr-2 h-5 w-5"/>
                        Purchase for <CircleDollarSign className="mx-2 h-5 w-5" /> {AI_CARD_BACK_COST}
                    </Button>
                </CardFooter>
            </Card>
        </main>
      </div>

      <Footer />
    </div>
  );
}
