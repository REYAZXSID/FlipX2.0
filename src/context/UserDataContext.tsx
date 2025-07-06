'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { LOCAL_STORAGE_KEYS, type PowerUp, type CardBack } from '@/lib/game-constants';
import { checkShopAchievement, type Achievement } from '@/lib/achievements';
import { useToast } from '@/hooks/use-toast';

export interface UserDataContextType {
    coins: number;
    powerups: Record<string, number>;
    inventory: string[];
    purchaseItem: (item: PowerUp | CardBack) => boolean;
    usePowerup: (id: PowerUp['id']) => boolean;
}

export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const getInitialData = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const defaultCoins = 200;
const defaultPowerups: Record<string, number> = { autoMatch: 1, secondChance: 0, xrayVision: 2 };
const defaultInventory: string[] = ['default'];

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const [coins, setCoins] = useState<number>(defaultCoins);
    const [powerups, setPowerups] = useState<Record<string, number>>(defaultPowerups);
    const [inventory, setInventory] = useState<string[]>(defaultInventory);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setCoins(getInitialData(LOCAL_STORAGE_KEYS.COINS, defaultCoins));
        setPowerups(getInitialData(LOCAL_STORAGE_KEYS.POWERUPS, defaultPowerups));
        setInventory(getInitialData(LOCAL_STORAGE_KEYS.INVENTORY, defaultInventory));
        setIsLoaded(true);
    }, []);

    useEffect(() => { if (isLoaded) { localStorage.setItem(LOCAL_STORAGE_KEYS.COINS, JSON.stringify(coins)); }}, [coins, isLoaded]);
    useEffect(() => { if (isLoaded) { localStorage.setItem(LOCAL_STORAGE_KEYS.POWERUPS, JSON.stringify(powerups)); }}, [powerups, isLoaded]);
    useEffect(() => { if (isLoaded) { localStorage.setItem(LOCAL_STORAGE_KEYS.INVENTORY, JSON.stringify(inventory)); }}, [inventory, isLoaded]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
           if (event.key === LOCAL_STORAGE_KEYS.COINS) setCoins(getInitialData(LOCAL_STORAGE_KEYS.COINS, defaultCoins));
           if (event.key === LOCAL_STORAGE_KEYS.POWERUPS) setPowerups(getInitialData(LOCAL_STORAGE_KEYS.POWERUPS, defaultPowerups));
           if (event.key === LOCAL_STORAGE_KEYS.INVENTORY) setInventory(getInitialData(LOCAL_STORAGE_KEYS.INVENTORY, defaultInventory));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const purchaseItem = useCallback((item: PowerUp | CardBack) => {
        if (coins < item.cost) {
            toast({ variant: 'destructive', title: 'Not enough coins!', description: `You need ${item.cost - coins} more coins.` });
            return false;
        }
        if ('className' in item && inventory.includes(item.id)) {
            toast({ title: 'Already Owned', description: `You already own the ${item.name} card back.` });
            return false;
        }

        setCoins(prev => prev - item.cost);

        if ('description' in item) {
            setPowerups(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
        } else {
            setInventory(prev => [...prev, item.id]);
        }

        const newAchievement = checkShopAchievement();
        if (newAchievement) {
            try {
                const existingAchievements: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS) || '[]');
                if (!existingAchievements.includes(newAchievement.id)) {
                    const allUnlocked = [...existingAchievements, newAchievement.id];
                    localStorage.setItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(allUnlocked));
                    toast({ title: 'Achievement Unlocked!', description: `${newAchievement.name}: ${newAchievement.description}` });
                    window.dispatchEvent(new Event('storage')); // Notify achievement widgets
                }
            } catch (e) { console.error("Failed to save shop achievement", e); }
        }
        
        toast({ title: 'Purchase Successful!', description: `You bought ${item.name}.` });
        return true;
    }, [coins, toast, inventory]);

    const usePowerup = useCallback((id: PowerUp['id']) => {
        if (powerups[id] > 0) {
            setPowerups(prev => ({ ...prev, [id]: prev[id] - 1 }));
            return true;
        }
        return false;
    }, [powerups]);

    const value = { coins, powerups, inventory, purchaseItem, usePowerup };

    return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};
