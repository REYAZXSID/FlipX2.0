
"use client";

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, CircleDollarSign, Zap, Layers, ArrowRight } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';

export default function ShopPage() {
    const { coins } = useUserData();

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-5xl mx-auto mt-8">
            <div className="flex justify-start w-full mb-6">
                <Button asChild variant="outline">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            
             <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-wide text-primary">FlipFun Shop</h1>
                <p className="text-muted-foreground mt-2">Use your FlipCoins to buy power-ups and cool card backs!</p>
                <div className="mt-6 inline-flex items-center justify-center gap-3 text-2xl font-bold bg-amber-400/10 text-amber-500 p-4 rounded-lg border border-amber-500/20">
                    <CircleDollarSign className="w-8 h-8"/>
                    <span>{coins} FlipCoins</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/shop/power-ups" className="group">
                    <Card className="h-full flex flex-col justify-between text-center transition-all duration-300 transform hover:scale-105 hover:border-primary/80 hover:shadow-2xl">
                        <CardHeader className="items-center p-6">
                            <div className="flex items-center justify-center w-24 h-24 rounded-full mb-4 bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-[-5deg]">
                                <Zap className="w-12 h-12" />
                            </div>
                            <CardTitle className="text-3xl font-headline">Power-Ups</CardTitle>
                            <CardDescription className="mt-2">Boost your game with powerful single-use items.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <Button variant="outline" className="w-full">
                                Browse Power-Ups <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/shop/card-backs" className="group">
                     <Card className="h-full flex flex-col justify-between text-center transition-all duration-300 transform hover:scale-105 hover:border-primary/80 hover:shadow-2xl">
                        <CardHeader className="items-center p-6">
                            <div className="flex items-center justify-center w-24 h-24 rounded-full mb-4 bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-[5deg]">
                                <Layers className="w-12 h-12" />
                            </div>
                            <CardTitle className="text-3xl font-headline">Card Backs</CardTitle>
                            <CardDescription className="mt-2">Customize your game with unique card designs.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <Button variant="outline" className="w-full">
                                Explore Designs <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
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
