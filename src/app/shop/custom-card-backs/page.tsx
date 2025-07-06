
"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, CircleDollarSign, Download, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/use-user-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import type { CustomCardBack } from '@/lib/game-constants';
import { Footer } from '@/components/layout/Footer';

const CUSTOM_CARD_BACK_COST = 150;

export default function CustomCardBacksShopPage() {
    const { coins, purchaseItem } = useUserData();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImageUrl(url);
        
        try {
            new URL(url);
            if (/\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url)) {
                 setIsValidUrl(true);
                 setIsLoading(true);
            } else {
                 setIsValidUrl(false);
                 setIsLoading(false);
            }
        } catch (_) {
            setIsValidUrl(false);
            setIsLoading(false);
        }
    };

    const handlePurchase = () => {
        if (!isValidUrl || !name.trim() || isLoading) {
             toast({ variant: 'destructive', title: 'Invalid Input', description: 'Please provide a valid name and image URL.' });
            return;
        }

        const newId = `user_${Date.now()}`;
        const newCardBack: CustomCardBack = {
            id: newId,
            name: name.trim(),
            cost: CUSTOM_CARD_BACK_COST,
            content: imageUrl,
            type: 'ai-premium',
            className: newId,
        };

        const success = purchaseItem(newCardBack);

        if (success) {
            setName('');
            setImageUrl('');
            setIsValidUrl(false);
            toast({ title: 'Custom Card Back Purchased!', description: 'You can now use your new design in-game.' });
        }
    }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
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
                <h1 className="text-3xl sm:text-4xl font-bold font-headline tracking-wide text-primary">Add Custom Card Back</h1>
                <p className="text-muted-foreground mt-2">Add your own card back design from an image URL.</p>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>1. Provide Details</CardTitle>
                    <CardDescription>Enter a name and a direct URL to your image.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input 
                        placeholder="My Awesome Design"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        aria-label="Card back name"
                    />
                    <div className="flex items-center gap-2">
                         <Input 
                            placeholder="https://example.com/image.png"
                            value={imageUrl}
                            onChange={handleUrlChange}
                            aria-label="Image URL"
                            className={!isValidUrl && imageUrl.length > 0 ? 'border-destructive' : ''}
                        />
                        {isValidUrl && !isLoading && <Check className="h-5 w-5 text-green-500" />}
                    </div>
                </CardContent>
                <CardHeader>
                    <CardTitle>2. Preview & Purchase</CardTitle>
                    <CardDescription>Your design will appear below if the URL is valid.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[220px] bg-muted/50 rounded-lg">
                    {isValidUrl && imageUrl ? (
                        <Image src={imageUrl} alt="Custom card back preview" width={200} height={200} className="rounded-lg shadow-lg border-4 border-card"
                           onLoad={() => setIsLoading(false)}
                           onError={() => {
                            setIsValidUrl(false);
                            setIsLoading(false);
                            toast({ variant: 'destructive', title: 'Image Load Error', description: 'Could not load the image from that URL.'});
                           }}
                        />
                    ) : (
                        <p className="text-muted-foreground text-center px-4">Preview will be shown here. Make sure the URL is a direct link to an image.</p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full font-bold text-lg h-12 mt-4" 
                        onClick={handlePurchase} 
                        disabled={!isValidUrl || !name.trim() || coins < CUSTOM_CARD_BACK_COST || isLoading}
                    >
                        <Download className="mr-2 h-5 w-5"/>
                        Purchase for <CircleDollarSign className="mx-2 h-5 w-5" /> {CUSTOM_CARD_BACK_COST}
                    </Button>
                </CardFooter>
            </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
}
