
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
            "flex flex-col text-center transition-all duration-300 transform hover:scale-105 group",
            isOwned ? "border-green-500/50 bg-green-500/5" : "border-border hover:border-primary/50"
        )}>
            <CardHeader className="items-center p-6">
                {Icon ? (
                    <div className="flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <Icon className="w-10 h-10" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-28 h-40 rounded-lg mb-4 p-2 card-face-front transition-transform group-hover:scale-105">
                        <div className={cn("w-full h-full rounded-md", cardBackClass)}></div>
                    </div>
                )}
                <CardTitle className="text-xl">{name}</CardTitle>
                <CardDescription className="text-sm h-10 mt-1">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter className="p-4">
                <Button className="w-full font-bold" onClick={onPurchase} disabled={isOwned}>
                    {isOwned ? (
                        <>
                            <Check className="mr-2 h-5 w-5" /> Owned
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
