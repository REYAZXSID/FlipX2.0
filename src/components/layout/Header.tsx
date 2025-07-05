
"use client";

import Link from 'next/link';
import { Gamepad2, Ellipsis, CircleDollarSign } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUserData } from '@/hooks/use-user-data';

export function Header() {
    const { coins } = useUserData();

  return (
    <header className="flex w-full items-center justify-between py-4 sm:py-6">
        <Link href="/" className="flex items-center gap-3 text-primary transition-transform hover:scale-105">
            <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce-slow" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-wider">
            FlipFun
            </h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg font-bold">
                 <CircleDollarSign className="w-6 h-6 text-yellow-500"/>
                 <span className="text-lg">{coins}</span>
            </div>
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="ghost" size="icon">
                            <Link href="/dashboard">
                                <Ellipsis className="h-5 w-5" />
                                <span className="sr-only">Dashboard</span>
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Dashboard</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <ThemeToggle />
        </div>
    </header>
  );
}
