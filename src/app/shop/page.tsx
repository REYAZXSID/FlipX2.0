
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sparkles, ArrowLeft, CircleDollarSign } from 'lucide-react';
import { POWERUPS, CARD_BACKS } from '@/lib/game-constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/use-user-data';
import { ShopItemCard } from '@/components/shop/ShopItemCard';

export default function ShopPage() {
    const { coins, purchaseItem, inventory } = useUserData();

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

            <div className="space-y-12">
                <section>
                    <h2 className="text-3xl font-bold font-headline mb-6 text-center">Power-Ups</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {POWERUPS.map((powerup) => (
                            <ShopItemCard 
                                key={powerup.id}
                                item={powerup}
                                onPurchase={() => purchaseItem(powerup)}
                            />
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-3xl font-bold font-headline mb-6 text-center">Card Backs</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CARD_BACKS.map((cardBack) => (
                            <ShopItemCard 
                                key={cardBack.id}
                                item={cardBack}
                                onPurchase={() => purchaseItem(cardBack)}
                                isOwned={inventory.includes(cardBack.id)}
                            />
                        ))}
                    </div>
                </section>
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
