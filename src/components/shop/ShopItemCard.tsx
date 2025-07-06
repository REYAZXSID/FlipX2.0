
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PowerUp, CardBack, CustomCardBack } from "@/lib/game-constants";
import type { SoundTheme } from "@/lib/sound-themes";
import { cn } from "@/lib/utils";
import { CircleDollarSign, Check, Music } from "lucide-react";
import Image from "next/image";

type ShopItemCardProps = {
    item: PowerUp | CardBack | SoundTheme | CustomCardBack;
    onPurchase: () => void;
    isOwned?: boolean;
};

export function ShopItemCard({ item, onPurchase, isOwned = false }: ShopItemCardProps) {
    const { name, cost } = item;
    let description: string;
    let Icon: React.ElementType | null = null;
    let cardBackClass = '';
    let customImage: string | undefined;

    if ('description' in item) { // PowerUp or SoundTheme
        description = item.description;
        Icon = 'Icon' in item ? item.Icon : Music;
    } else if ('className' in item) { // CardBack or CustomCardBack
        description = `Unlock the "${item.name}" card style.`;
        cardBackClass = item.className;
        if('content' in item) customImage = item.content;
    } else { // Fallback
        description = "A cool new item for your collection.";
    }
    
    return (
        <Card className={cn(
            "relative flex flex-col text-center transition-all duration-300 group overflow-hidden shadow-lg border-border/80",
             isOwned ? "border-green-500/50" : "hover:border-primary/50 hover:shadow-primary/20 hover:-translate-y-1"
        )}>
            {isOwned && (
                 <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                    <Check className="w-4 h-4" />
                    <span>Owned</span>
                 </div>
            )}
            <CardHeader className="items-center p-6 bg-muted/50">
                {Icon ? (
                    <div className="flex items-center justify-center w-24 h-24 rounded-full mb-4 bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <Icon className="w-12 h-12" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-28 h-40 rounded-lg mb-4 p-2 card-face-front transition-transform group-hover:scale-105 border-2 border-border bg-card shadow-inner">
                        <div className={cn("w-full h-full rounded-md relative", cardBackClass)}>
                            {customImage && <Image src={customImage} alt={name} fill className="object-cover rounded-md" />}
                        </div>
                    </div>
                )}
                <CardTitle className="text-2xl font-headline truncate w-full px-2">{name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 flex-grow">
                 <CardDescription className="text-sm text-muted-foreground min-h-[40px]">
                    {description}
                </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full font-bold text-lg h-12" onClick={onPurchase} disabled={isOwned}>
                    {isOwned ? (
                        <>
                            <Check className="mr-2 h-5 w-5" /> Acquired
                        </>
                    ) : (
                        <>
                            <CircleDollarSign className="mr-2 h-5 w-5" /> {cost}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
