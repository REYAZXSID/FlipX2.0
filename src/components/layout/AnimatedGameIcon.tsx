"use client";

import React, { useState, useEffect } from 'react';
import { Spade, Diamond, Heart, Club } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = [
    { Icon: Spade, color: 'text-foreground' },
    { Icon: Heart, color: 'text-destructive' },
    { Icon: Diamond, color: 'text-destructive' },
    { Icon: Club, color: 'text-foreground' },
];

export function AnimatedGameIcon() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % icons.length);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center">
            {icons.map((item, index) => {
                const { Icon, color } = item;
                return (
                    <Icon
                        key={index}
                        className={cn(
                            "absolute w-full h-full transition-all duration-500 transform",
                            color,
                            currentIndex === index
                                ? 'opacity-100 scale-100 rotate-0'
                                : 'opacity-0 scale-90 -rotate-12'
                        )}
                        style={{
                            transitionDelay: currentIndex === index ? '200ms' : '0ms'
                        }}
                    />
                )
            })}
        </div>
    );
}
