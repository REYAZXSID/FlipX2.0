
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PowerUp, CardBack } from "@/lib/game-constants";
import { cn } from "@/lib/utils";
import { CircleDollarSign, Check } from "lucide-react";

type ShopItemCardProps = {
    item: PowerUp | CardBack;
    onPurchase: () => void;
    isOwned?: boolean;
};

export function ShopItemCard({ item, onPurchase, isOwned = false }: ShopItemCardProps) {
    const { name, cost } = item;
    const description = 'description' in item ? item.description : item.name;
    const Icon = 'Icon' in item ? item.Icon : null;
    const cardBackClass = !Icon ? item.className : '';
    
    return (
        <Card className={cn(
            "flex flex-col text-center transition-all duration-300 transform hover:scale-105",
            isOwned ? "border-green-500/50" : "border-border"
        )}>
            <CardHeader className="items-center pb-2">
                {Icon ? (
                    <div className="flex items-center justify-center w-16 h-16 rounded-full mb-2 bg-primary/10 text-primary">
                        <Icon className="w-8 h-8" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-24 h-36 rounded-lg mb-2 p-2 card-face-front">
                        <div className={cn("w-full h-full rounded-md", cardBackClass)}></div>
                    </div>
                )}
                <CardTitle>{name}</CardTitle>
                <CardDescription className="text-sm h-10">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter>
                <Button className="w-full" onClick={onPurchase} disabled={isOwned}>
                    {isOwned ? (
                        <>
                            <Check className="mr-2" /> Owned
                        </>
                    ) : (
                        <>
                            <CircleDollarSign className="mr-2" /> {cost}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
