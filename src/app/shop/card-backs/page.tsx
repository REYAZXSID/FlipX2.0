
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Code, ArrowLeft, CircleDollarSign, Wand2 } from 'lucide-react';
import { CARD_BACKS } from '@/lib/game-constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/use-user-data';
import { ShopItemCard } from '@/components/shop/ShopItemCard';
import { Separator } from '@/components/ui/separator';

export default function CardBacksShopPage() {
    const { coins, purchaseItem, inventory, customCardBacks } = useUserData();

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
                <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-wide text-primary">Card Backs</h1>
                <p className="text-muted-foreground mt-2">Give your game a fresh new look.</p>
            </div>

            <h2 className="text-2xl font-headline mb-4">Standard Designs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {CARD_BACKS.map((cardBack) => (
                    <ShopItemCard 
                        key={cardBack.id}
                        item={cardBack}
                        onPurchase={() => purchaseItem(cardBack)}
                        isOwned={inventory.includes(cardBack.id)}
                    />
                ))}
            </div>

            {customCardBacks.length > 0 && (
                <>
                    <Separator className="my-12" />
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-headline flex items-center justify-center gap-3">
                            <Wand2 className="w-8 h-8 text-primary"/>
                            Your AI Creations
                        </h2>
                        <p className="text-muted-foreground mt-2">Your collection of custom-generated card backs.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {customCardBacks.map((cardBack) => (
                            <ShopItemCard 
                                key={cardBack.id}
                                item={cardBack}
                                onPurchase={() => {}}
                                isOwned={true}
                            />
                        ))}
                    </div>
                </>
            )}
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
