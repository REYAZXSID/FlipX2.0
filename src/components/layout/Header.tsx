"use client";

import Link from 'next/link';
import { Gamepad2, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Header() {
  return (
    <header className="flex w-full items-center justify-between py-4 sm:py-6">
        <Link href="/" className="flex items-center gap-3 text-primary transition-transform hover:scale-105">
            <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce-slow" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-wider">
            FlipFun
            </h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="outline" size="icon">
                            <Link href="/dashboard">
                                <LayoutDashboard className="h-5 w-5" />
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
