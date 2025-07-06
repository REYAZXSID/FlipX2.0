
"use client";

import { POWERUPS } from "@/lib/game-constants";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

type PowerupToolbarProps = {
    powerups: Record<string, number>;
    onUsePowerup: (id: 'autoMatch' | 'secondChance' | 'xrayVision') => void;
};

const powerupColors: Record<string, string> = {
    autoMatch: "text-yellow-500",
    secondChance: "text-red-500",
    xrayVision: "text-blue-500",
};

export function PowerupToolbar({ powerups, onUsePowerup }: PowerupToolbarProps) {
    return (
        <TooltipProvider>
            <div className="flex items-center gap-2 justify-center bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg border">
                {POWERUPS.map(powerup => {
                    const count = powerups[powerup.id] || 0;
                    return (
                         <Tooltip key={powerup.id}>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onUsePowerup(powerup.id)}
                                    disabled={count === 0}
                                    className="relative w-12 h-12 rounded-full"
                                >
                                    <powerup.Icon className={cn("h-6 w-6 transition-colors", powerupColors[powerup.id])} />
                                    <span className="sr-only">{powerup.name}</span>
                                    {count > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">{count}</span>}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p className="font-bold">{powerup.name}</p>
                                <p>{powerup.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </div>
        </TooltipProvider>
    );
}
