
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Hourglass } from 'lucide-react';
import { startOfTomorrow, differenceInSeconds } from 'date-fns';

const formatTime = (totalSeconds: number): string => {
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function MissionCountdown() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const timeLeft = useMemo(() => {
        const tomorrow = startOfTomorrow();
        const remainingSeconds = differenceInSeconds(tomorrow, now);
        return formatTime(remainingSeconds);
    }, [now]);

    return (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4 p-2 bg-muted/50 rounded-md">
            <Hourglass className="w-4 h-4" />
            <span>New missions in: <strong>{timeLeft}</strong></span>
        </div>
    );
}
