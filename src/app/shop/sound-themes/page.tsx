
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Code, ArrowLeft, CircleDollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/use-user-data';
import { ShopItemCard } from '@/components/shop/ShopItemCard';
import { SOUND_THEMES } from '@/lib/sound-themes';

export default function SoundThemesShopPage() {
    const { coins, purchaseItem, soundThemeInventory } = useUserData();

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-5xl mx-auto mt-8">
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
                <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-wide text-primary">Sound Themes</h1>
                <p className="text-muted-foreground mt-2">Give your game a fresh new sound.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SOUND_THEMES.map((theme) => (
                    <ShopItemCard 
                        key={theme.id}
                        item={theme}
                        onPurchase={() => purchaseItem(theme)}
                        isOwned={soundThemeInventory.includes(theme.id)}
                    />
                ))}
            </div>
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
