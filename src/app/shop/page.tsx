
"use client";

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CircleDollarSign, Zap, Layers, ArrowRight, Music, Wand2, ShoppingCart, Upload } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import { Footer } from '@/components/layout/Footer';

export default function ShopPage() {
    const { coins } = useUserData();

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4 relative overflow-hidden">
        <ShoppingCart className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] text-primary opacity-5 -z-10" />
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-5xl mx-auto mt-8">
            <div className="flex justify-between items-center w-full mb-6">
                <Button asChild variant="outline">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <div className="inline-flex items-center justify-center gap-2 text-lg font-bold bg-amber-400/10 text-amber-500 p-3 rounded-lg border border-amber-500/20">
                    <CircleDollarSign className="w-6 h-6"/>
                    <span>{coins}</span>
                </div>
            </div>
            
             <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold font-headline tracking-wide text-primary">FlipFun Shop</h1>
                <p className="text-muted-foreground mt-2">Use your FlipCoins to buy power-ups and cool card backs!</p>
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
                <Link href="/shop/sound-themes" className="group">
                     <Card className="h-full flex flex-col justify-between text-center transition-all duration-300 transform hover:scale-105 hover:border-primary/80 hover:shadow-2xl">
                        <CardHeader className="items-center p-6">
                            <div className="flex items-center justify-center w-24 h-24 rounded-full mb-4 bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-[-5deg]">
                                <Music className="w-12 h-12" />
                            </div>
                            <CardTitle className="text-3xl font-headline">Sound Themes</CardTitle>
                            <CardDescription className="mt-2">Change the game's audio with new sound packs.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <Button variant="outline" className="w-full">
                                Browse Sounds <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/shop/ai-card-backs" className="group">
                     <Card className="h-full flex flex-col justify-between text-center transition-all duration-300 transform hover:scale-105 hover:border-primary/80 hover:shadow-2xl">
                        <CardHeader className="items-center p-6">
                            <div className="flex items-center justify-center w-24 h-24 rounded-full mb-4 bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-[5deg]">
                                <Wand2 className="w-12 h-12" />
                            </div>
                            <CardTitle className="text-3xl font-headline">AI Card Backs</CardTitle>
                            <CardDescription className="mt-2">Generate your own card designs with AI!</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <Button variant="outline" className="w-full">
                                Create Your Own <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/shop/custom-card-backs" className="group">
                    <Card className="h-full flex flex-col justify-between text-center transition-all duration-300 transform hover:scale-105 hover:border-primary/80 hover:shadow-2xl">
                        <CardHeader className="items-center p-6">
                            <div className="flex items-center justify-center w-24 h-24 rounded-full mb-4 bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-[5deg]">
                                <Upload className="w-12 h-12" />
                            </div>
                            <CardTitle className="text-3xl font-headline">Upload Your Own</CardTitle>
                            <CardDescription className="mt-2">Add a custom card back from an image URL.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <Button variant="outline" className="w-full">
                                Add Design <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
