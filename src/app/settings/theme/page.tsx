
"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from '@/components/layout/Header';
import { StepHeader } from '@/components/layout/StepHeader';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { THEMES, CARD_BACKS, DEFAULT_SETTINGS, LOCAL_STORAGE_KEYS, type CustomCardBack } from "@/lib/game-constants";
import { SOUND_THEMES } from '@/lib/sound-themes';
import { Loader2, Lock, Code, Smile, Globe, CaseSensitive, Music, Palette } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils";
import { generateCards } from '@/ai/flows/generate-cards-flow';
import { useToast } from '@/hooks/use-toast';
import { setAICards } from '@/lib/ai-card-cache';

const FormSchema = z.object({
  theme: z.string().min(1, "Please select a theme."),
  cardBack: z.string().min(1, "Please select a card back."),
  soundTheme: z.string().min(1, "Please select a sound theme."),
  customTheme: z.string().optional(),
}).refine(data => {
    if (data.theme === 'ai-magic') {
        return !!data.customTheme && data.customTheme.length > 2;
    }
    return true;
}, {
    message: "Please enter a theme with at least 3 characters.",
    path: ["customTheme"],
});

type FormValues = z.infer<typeof FormSchema>;

function ThemeSelectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { inventory, customCardBacks, soundThemeInventory } = useUserData();
    const [isGenerating, setIsGenerating] = useState(false);

    const gameMode = searchParams.get('gameMode');
    const gridSize = searchParams.get('gridSize');

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: () => {
             const saved = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
             return {
                theme: saved.theme,
                cardBack: saved.cardBack,
                soundTheme: saved.soundTheme,
                customTheme: ''
             }
        },
    });

    const selectedTheme = useWatch({ control: form.control, name: "theme" });

    useEffect(() => {
        if (!gameMode || !gridSize) {
            router.replace('/');
        }
    }, [gameMode, gridSize, router]);

    const handleStartGame = async (data: FormValues) => {
        if (!gameMode || !gridSize) return;

        try {
            const currentSettings = getInitialData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
            const fullSettings = { ...currentSettings, ...data };
            localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(fullSettings));
        } catch (error) {
           console.error("Could not save settings to localStorage", error);
        }

        const params = new URLSearchParams({
            gameMode,
            gridSize,
            theme: data.theme,
            cardBack: data.cardBack,
            soundTheme: data.soundTheme,
        });

        if (data.theme === 'ai-magic') {
            setIsGenerating(true);
            try {
                const numPairs = (Number(gridSize) * Number(gridSize)) / 2;
                const generatedPairs = await generateCards({ theme: data.customTheme!, numPairs });
                
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

    if (!gameMode || !gridSize) {
        return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
    }
    
    const allCardBacks = [...CARD_BACKS, ...customCardBacks];

    return (
        <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
                <Header />
                <main className="w-full flex flex-col items-center mt-8">
                    <StepHeader title="Customize Your Game" step={3} totalSteps={3} />
                    <Card className="w-full max-w-md mt-12 shadow-lg animate-fly-in">
                      <CardHeader>
                        <CardTitle>Final Touches</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleStartGame)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="theme"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Card Theme</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a theme" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
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
                                                    <SelectItem key={theme.name} value={theme.name}>
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="w-4 h-4" />
                                                            <span>{theme.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {selectedTheme === 'ai-magic' && (
                                    <FormField
                                        control={form.control}
                                        name="customTheme"
                                        render={({ field }) => (
                                        <FormItem className="animate-fly-in">
                                            <FormLabel>Custom AI Theme</FormLabel>
                                            <FormControl>
                                            <Input 
                                                placeholder="e.g. 'Cute Dinosaurs' or 'Vintage Cars'" 
                                                {...field}
                                            />
                                            </FormControl>
                                            <FormDescription>Describe the theme you want the AI to create!</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                )}
                                 <FormField
                                    control={form.control}
                                    name="cardBack"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Card Back Style</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a card back" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectLabel>
                                                    <div className="flex items-center gap-2"><Palette className="w-4 h-4" /> Standard</div>
                                                </SelectLabel>
                                                {CARD_BACKS.map((back) => {
                                                    const isOwned = inventory.includes(back.id);
                                                    return (
                                                        <SelectItem key={back.id} value={back.id} disabled={!isOwned}>
                                                            <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn("w-10 h-7 rounded-sm flex-shrink-0 border", back.className)}></div>
                                                                <span>{back.name}</span>
                                                            </div>
                                                            {!isOwned && <Lock className="w-4 h-4 text-muted-foreground ml-2" />}
                                                        </div>
                                                        </SelectItem>
                                                    )
                                                })}
                                                {customCardBacks.length > 0 && <SelectLabel><div className="flex items-center gap-2"><Code className="w-4 h-4" /> AI Generated</div></SelectLabel>}
                                                {customCardBacks.map((back: CustomCardBack) => (
                                                    <SelectItem key={back.id} value={back.id}>
                                                        <div className="flex items-center gap-3">
                                                          <img src={back.content} alt={back.name} className="w-10 h-7 rounded-sm border object-cover" />
                                                          <span className="truncate">{back.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="soundTheme"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Sound Theme</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a sound theme" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                            {SOUND_THEMES.map((theme) => {
                                                const isOwned = soundThemeInventory.includes(theme.id);
                                                return (
                                                    <SelectItem key={theme.id} value={theme.id} disabled={!isOwned}>
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-2">
                                                                <Music className="w-4 h-4" />
                                                                <span>{theme.name}</span>
                                                            </div>
                                                            {!isOwned && <Lock className="w-4 h-4 text-muted-foreground ml-2" />}
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" size="lg" className="w-full text-lg font-bold" disabled={isGenerating}>
                                    {isGenerating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                    {isGenerating ? 'Generating...' : 'Start Game'}
                                </Button>
                            </form>
                        </Form>
                      </CardContent>
                    </Card>
                </main>
            </div>
            <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
                <p className="inline-flex items-center gap-2">
                    Build by Sid <Code className="w-4 h-4 text-accent" />
                </p>
            </footer>
        </div>
    );
}

const getInitialData = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
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
