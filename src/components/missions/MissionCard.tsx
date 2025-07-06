
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/lib/missions";
import { cn } from "@/lib/utils";
import { CircleDollarSign, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type MissionCardProps = {
    mission: Mission;
    onClaim: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const difficultyColors: Record<string, string> = {
    Easy: 'bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400',
}

export function MissionCard({ mission, onClaim, className, ...props }: MissionCardProps) {
    const { title, description, Icon, difficulty, reward, progress, goal, isClaimed } = mission;
    const isCompleted = progress >= goal;

    return (
        <Card
            className={cn(
                "flex flex-col text-center transition-all duration-300 transform hover:-translate-y-1 animate-fly-in",
                isCompleted && !isClaimed ? "border-primary/80 shadow-primary/20" : "shadow-lg border-border/80",
                className
            )}
            {...props}
        >
            <CardHeader className="items-center p-6">
                <div className={cn("flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-primary/10 text-primary transition-transform group-hover:scale-110", { 'text-green-500': isCompleted })}>
                    <Icon className="w-10 h-10" />
                </div>
                <CardTitle className="text-xl font-headline">{title}</CardTitle>
                <Badge variant="outline" className={cn("mt-2", difficultyColors[difficulty])}>{difficulty}</Badge>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-grow">
                <CardDescription className="text-sm text-muted-foreground min-h-[40px] mb-4">
                    {description}
                </CardDescription>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.min(progress, goal)} / {goal}</span>
                    </div>
                    <Progress value={(progress / goal) * 100} className="h-2.5" />
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full font-bold text-lg h-12" onClick={onClaim} disabled={!isCompleted || isClaimed}>
                    {isClaimed ? (
                        <>
                            <Check className="mr-2 h-5 w-5" /> Claimed
                        </>
                    ) : isCompleted ? (
                        <>
                           Claim <CircleDollarSign className="ml-2 h-5 w-5" /> {reward}
                        </>
                    ) : (
                        <>
                           <CircleDollarSign className="mr-2 h-5 w-5" /> {reward}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
