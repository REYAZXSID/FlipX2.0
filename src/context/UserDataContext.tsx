
'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { LOCAL_STORAGE_KEYS, type PowerUp, type CardBack } from '@/lib/game-constants';
import { checkShopAchievement, type Achievement } from '@/lib/achievements';
import { useToast } from '@/hooks/use-toast';
import { DAILY_MISSIONS, type Mission, type MissionState } from '@/lib/missions';


export interface UserDataContextType {
    coins: number;
    powerups: Record<string, number>;
    inventory: string[];
    missions: Mission[];
    purchaseItem: (item: PowerUp | CardBack) => boolean;
    usePowerup: (id: PowerUp['id']) => boolean;
    logGameWin: (args: { coinsEarned: number }) => void;
    claimMissionReward: (missionId: string) => void;
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
const defaultMissions: MissionState = {};

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const [coins, setCoins] = useState<number>(defaultCoins);
    const [powerups, setPowerups] = useState<Record<string, number>>(defaultPowerups);
    const [inventory, setInventory] = useState<string[]>(defaultInventory);
    const [missionState, setMissionState] = useState<MissionState>(defaultMissions);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setCoins(getInitialData(LOCAL_STORAGE_KEYS.COINS, defaultCoins));
        setPowerups(getInitialData(LOCAL_STORAGE_KEYS.POWERUPS, defaultPowerups));
        setInventory(getInitialData(LOCAL_STORAGE_KEYS.INVENTORY, defaultInventory));
        setMissionState(getInitialData(LOCAL_STORAGE_KEYS.MISSIONS, defaultMissions));
        setIsLoaded(true);
    }, []);

    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.COINS, JSON.stringify(coins)); }, [coins, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.POWERUPS, JSON.stringify(powerups)); }, [powerups, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.INVENTORY, JSON.stringify(inventory)); }, [inventory, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.MISSIONS, JSON.stringify(missionState)); }, [missionState, isLoaded]);


    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
           if (event.key === LOCAL_STORAGE_KEYS.COINS) setCoins(getInitialData(LOCAL_STORAGE_KEYS.COINS, defaultCoins));
           if (event.key === LOCAL_STORAGE_KEYS.POWERUPS) setPowerups(getInitialData(LOCAL_STORAGE_KEYS.POWERUPS, defaultPowerups));
           if (event.key === LOCAL_STORAGE_KEYS.INVENTORY) setInventory(getInitialData(LOCAL_STORAGE_KEYS.INVENTORY, defaultInventory));
           if (event.key === LOCAL_STORAGE_KEYS.MISSIONS) setMissionState(getInitialData(LOCAL_STORAGE_KEYS.MISSIONS, defaultMissions));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const missions: Mission[] = useMemo(() => {
        return DAILY_MISSIONS.map(def => {
            const state = missionState[def.id] || { progress: 0, isClaimed: false };
            return {
                ...def,
                progress: state.progress,
                isClaimed: state.isClaimed,
            }
        })
    }, [missionState]);
    
    const logGameWin = useCallback(({ coinsEarned }: { coinsEarned: number }) => {
        setMissionState(prev => {
            const newState: MissionState = JSON.parse(JSON.stringify(prev)); // Deep copy

            // Helper to update progress
            const updateProgress = (id: string, amount: number) => {
                const missionDef = DAILY_MISSIONS.find(m => m.id === id);
                if (!missionDef) return;
                
                const mission = newState[id] || { progress: 0, isClaimed: false };
                if (!mission.isClaimed) {
                    mission.progress = Math.min(mission.progress + amount, missionDef.goal);
                    newState[id] = mission;
                }
            };

            updateProgress('win_3_games', 1);
            updateProgress('earn_100_coins', coinsEarned);
            
            return newState;
        });
    }, []);

    const claimMissionReward = useCallback((missionId: string) => {
        const missionDef = DAILY_MISSIONS.find(m => m.id === missionId);
        if (!missionDef) return;
        
        const currentMissionState = missionState[missionId];
        if (currentMissionState && currentMissionState.progress >= missionDef.goal && !currentMissionState.isClaimed) {
            setCoins(prev => prev + missionDef.reward);
            setMissionState(prev => ({
                ...prev,
                [missionId]: { ...prev[missionId], isClaimed: true },
            }));
            toast({ title: "Reward Claimed!", description: `You received ${missionDef.reward} coins.` });
        }
    }, [missionState, toast]);

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
                    window.dispatchEvent(new Event('storage'));
                }
            } catch (e) { console.error("Failed to save shop achievement", e); }
        }
        
        toast({ title: 'Purchase Successful!', description: `You bought ${item.name}.` });
        return true;
    }, [coins, toast, inventory]);

    const usePowerup = useCallback((id: PowerUp['id']) => {
        if (powerups[id] > 0) {
            setPowerups(prev => ({ ...prev, [id]: prev[id] - 1 }));

            setMissionState(prev => {
                const newState: MissionState = JSON.parse(JSON.stringify(prev));
                 const missionDef = DAILY_MISSIONS.find(m => m.id === 'use_3_powerups');
                 if (!missionDef) return newState;
                const mission = newState['use_3_powerups'] || { progress: 0, isClaimed: false };
                 if (!mission.isClaimed) {
                    mission.progress = Math.min(mission.progress + 1, missionDef.goal);
                    newState['use_3_powerups'] = mission;
                }
                return newState;
            });
            return true;
        }
        return false;
    }, [powerups]);

    const value = { coins, powerups, inventory, missions, purchaseItem, usePowerup, logGameWin, claimMissionReward };

    return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};
