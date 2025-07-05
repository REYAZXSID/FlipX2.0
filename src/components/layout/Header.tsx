
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Trophy, Home, ShoppingCart, CircleDollarSign } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUserData } from '@/hooks/use-user-data';

export function Header() {
    const { coins } = useUserData();
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", Icon: Home },
        { href: "/shop", label: "Shop", Icon: ShoppingCart },
        { href: "/achievements", label: "Achievements", Icon: Trophy },
    ];

  return (
    <header className="flex w-full items-center justify-between py-4 sm:py-6">
        <Link href="/" className="flex items-center gap-3 text-primary transition-transform hover:scale-105">
            <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce-slow" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-wider">
            FlipFun
            </h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-muted/50 p-2 rounded-lg font-bold">
                 <CircleDollarSign className="w-6 h-6 text-yellow-500"/>
                 <span className="text-lg">{coins}</span>
            </div>
            <nav className="hidden sm:flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                <TooltipProvider>
                    {navItems.map(item => (
                         <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                                <Button asChild variant={pathname === item.href ? "secondary" : "ghost"} size="icon">
                                    <Link href={item.href}>
                                        <item.Icon className="h-5 w-5" />
                                        <span className="sr-only">{item.label}</span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{item.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </nav>
            <ThemeToggle />
        </div>
    </header>
  );
}
