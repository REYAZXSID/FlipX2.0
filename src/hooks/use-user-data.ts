
"use client";

import { useState, useEffect, useCallback } from 'react';
import { LOCAL_STORAGE_KEYS, type PowerUp, type CardBack } from '@/lib/game-constants';
import { checkShopAchievement } from '@/lib/achievements';
import { useToast } from './use-toast';

type PowerUpCounts = Record<PowerUp['id'], number>;
type Inventory = string[]; // Array of CardBack IDs

// Default values, used for initial render to prevent hydration mismatch.
const defaultCoins = 200;
const defaultPowerups: PowerUpCounts = { autoMatch: 1, secondChance: 0, xrayVision: 2 };
const defaultInventory: Inventory = ['default'];

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

export const useUserData = () => {
    const { toast } = useToast();
    const [coins, setCoins] = useState<number>(defaultCoins);
    const [powerups, setPowerups] = useState<PowerUpCounts>(defaultPowerups);
    const [inventory, setInventory] = useState<Inventory>(defaultInventory);
    const [isLoaded, setIsLoaded] = useState(false); // Flag to prevent writing defaults to storage on initial render.

    // Load data from localStorage on initial client-side render.
    useEffect(() => {
        setCoins(getInitialData(LOCAL_STORAGE_KEYS.COINS, defaultCoins));
        setPowerups(getInitialData(LOCAL_STORAGE_KEYS.POWERUPS, defaultPowerups));
        setInventory(getInitialData(LOCAL_STORAGE_KEYS.INVENTORY, defaultInventory));
        setIsLoaded(true);
    }, []);

    // Save data back to localStorage whenever it changes, but only after it has been loaded.
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.COINS, JSON.stringify(coins));
        }
    }, [coins, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.POWERUPS, JSON.stringify(powerups));
        }
    }, [powerups, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
        }
    }, [inventory, isLoaded]);

    const purchaseItem = useCallback((item: PowerUp | CardBack) => {
        if (coins < item.cost) {
            toast({
                variant: 'destructive',
                title: 'Not enough coins!',
                description: `You need ${item.cost - coins} more coins to buy this.`,
            });
            return false;
        }

        setCoins(prev => prev - item.cost);

        if ('description' in item) { // It's a PowerUp
            setPowerups(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
        } else { // It's a CardBack
            if (inventory.includes(item.id)) return true; // Already owned
            setInventory(prev => [...prev, item.id]);
        }

        const newAchievement = checkShopAchievement();
        if (newAchievement) {
             toast({
                title: 'Achievement Unlocked!',
                description: `${newAchievement.name}: ${newAchievement.description}`,
            });
        }
        
        toast({
            title: 'Purchase Successful!',
            description: `You bought ${item.name}.`,
        });

        // This event tells other components that user data has changed.
        window.dispatchEvent(new Event('storage'));

        return true;
    }, [coins, toast, inventory]);

    const usePowerup = useCallback((id: PowerUp['id']) => {
        if (powerups[id] > 0) {
            setPowerups(prev => ({ ...prev, [id]: prev[id] - 1 }));
            window.dispatchEvent(new Event('storage'));
            return true;
        }
        return false;
    }, [powerups]);
    
    // Listen for changes from other tabs.
    useEffect(() => {
        const handleStorageChange = () => {
           setCoins(getInitialData(LOCAL_STORAGE_KEYS.COINS, defaultCoins));
           setPowerups(getInitialData(LOCAL_STORAGE_KEYS.POWERUPS, defaultPowerups));
           setInventory(getInitialData(LOCAL_STORAGE_KEYS.INVENTORY, defaultInventory));
        };
    
        window.addEventListener('storage', handleStorageChange);
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, []);

    return { coins, powerups, inventory, purchaseItem, usePowerup };
};
