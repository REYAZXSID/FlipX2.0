
"use client";

import Link from 'next/link';
import { LayoutDashboard, Instagram } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProfileButton } from './ProfileButton';
import { AnimatedGameIcon } from './AnimatedGameIcon';

export function Header() {
  return (
    <header className="flex w-full items-center justify-between py-4 sm:py-6">
        <Link href="/" className="flex items-center gap-3 text-primary transition-transform hover:scale-105">
            <AnimatedGameIcon />
            <h1 className="text-3xl sm:text-4xl font-bold font-headline tracking-wider drop-shadow-lg">
            FlipX
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

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="outline" size="icon">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Instagram</p>
                    </TooltipContent>
                </Tooltip>

                <ThemeToggle />
                <ProfileButton />
            </TooltipProvider>
        </div>
    </header>
  );
}
