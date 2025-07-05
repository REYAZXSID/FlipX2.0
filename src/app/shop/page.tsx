
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { POWERUPS, CARD_BACKS } from '@/lib/game-constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/use-user-data';
import { ShopItemCard } from '@/components/shop/ShopItemCard';

export default function ShopPage() {
    const { purchaseItem, inventory } = useUserData();

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-4xl mx-auto mt-8">
            <Card className="shadow-xl border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-center text-4xl font-headline tracking-wide">Shop</CardTitle>
                    <p className="text-center text-muted-foreground">
                        Use your FlipCoins to buy power-ups and cool card backs!
                    </p>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold font-headline mb-4 text-center">Power-Ups</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {POWERUPS.map((powerup) => (
                                <ShopItemCard 
                                    key={powerup.id}
                                    item={powerup}
                                    onPurchase={() => purchaseItem(powerup)}
                                />
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-2xl font-bold font-headline mb-4 text-center">Card Backs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {CARD_BACKS.map((cardBack) => (
                                <ShopItemCard 
                                    key={cardBack.id}
                                    item={cardBack}
                                    onPurchase={() => purchaseItem(cardBack)}
                                    isOwned={inventory.includes(cardBack.id)}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
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
