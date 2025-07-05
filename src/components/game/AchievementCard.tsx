"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Achievement } from "@/lib/achievements";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

type AchievementCardProps = {
    achievement: Achievement;
    isUnlocked: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function AchievementCard({ achievement, isUnlocked, className, ...props }: AchievementCardProps) {
    const { Icon } = achievement;
    return (
        <Card
          className={cn(
            "flex flex-col items-center justify-center p-4 text-center transition-all duration-300 transform hover:scale-105 animate-fly-in",
            isUnlocked ? "bg-card border-yellow-500/50 shadow-lg" : "bg-muted/60",
            className
          )}
          {...props}
        >
            <div
                className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors",
                    isUnlocked ? "bg-yellow-400/20 text-yellow-500" : "bg-muted-foreground/20 text-muted-foreground"
                )}
            >
                {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
            </div>
            <CardHeader className="p-0">
                <CardTitle className="text-lg">{achievement.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-1">
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </CardContent>
        </Card>
    );
}
