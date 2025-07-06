
'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { LOCAL_STORAGE_KEYS, type PowerUp, type CardBack } from '@/lib/game-constants';
import { checkShopAchievement, type Achievement } from '@/lib/achievements';
import { useToast } from '@/hooks/use-toast';
import { MISSION_POOL, type Mission, type MissionState, type MissionDefinition } from '@/lib/missions';


export interface UserDataContextType {
    coins: number;
    powerups: Record<string, number>;
    inventory: string[];
    missions: Mission[];
    purchaseItem: (item: PowerUp | CardBack) => boolean;
    usePowerup: (id: PowerUp['id']) => boolean;
    logGameWin: (args: { coinsEarned: number; gridSize: number; moves: number; gameMode: string; theme: string; }) => void;
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
    const [dailyMissionIds, setDailyMissionIds] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const today = new Date();
        const lastResetStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.MISSIONS_RESET_DATE);
        const lastResetDate = lastResetStorage ? new Date(lastResetStorage) : null;

        let missionIds: string[];

        if (!lastResetDate || lastResetDate.getDate() !== today.getDate()) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.MISSIONS, JSON.stringify({}));
            localStorage.setItem(LOCAL_STORAGE_KEYS.MISSIONS_RESET_DATE, today.toISOString());
            setMissionState({});

            const shuffled = [...MISSION_POOL].sort(() => 0.5 - Math.random());
            missionIds = shuffled.slice(0, 3).map(m => m.id);
            localStorage.setItem(LOCAL_STORAGE_KEYS.DAILY_MISSION_IDS, JSON.stringify(missionIds));
        } else {
            missionIds = getInitialData(LOCAL_STORAGE_KEYS.DAILY_MISSION_IDS, []);
        }
        
        setDailyMissionIds(missionIds);
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
        if (!dailyMissionIds.length) return [];
        return dailyMissionIds
            .map(id => MISSION_POOL.find(def => def.id === id))
            .filter((def): def is MissionDefinition => !!def)
            .map(def => {
                const state = missionState[def.id] || { progress: 0, isClaimed: false };
                return { ...def, ...state };
            });
    }, [missionState, dailyMissionIds]);
    
    const logGameWin = useCallback((args: { coinsEarned: number, gridSize: number, moves: number, gameMode: string, theme: string }) => {
        const { coinsEarned, gridSize, moves, gameMode, theme } = args;
        setMissionState(prev => {
            const newState: MissionState = JSON.parse(JSON.stringify(prev));

            const updateProgress = (id: string, amount: number) => {
                const missionDef = MISSION_POOL.find(m => m.id === id);
                if (!missionDef || !dailyMissionIds.includes(id)) return;
                
                const mission = newState[id] || { progress: 0, isClaimed: false };
                if (!mission.isClaimed) {
                    mission.progress = Math.min((mission.progress || 0) + amount, missionDef.goal);
                    newState[id] = mission;
                }
            };

            updateProgress('win_1_game', 1);
            updateProgress('win_3_games', 1);
            updateProgress('win_5_games', 1);
            
            updateProgress('earn_50_coins', coinsEarned);
            updateProgress('earn_100_coins', coinsEarned);
            updateProgress('earn_200_coins', coinsEarned);
            
            if (gridSize === 2 && moves === 2) updateProgress('perfect_2x2', 1);
            if (gridSize === 4 && moves === 8) updateProgress('perfect_4x4', 1);
            if (gridSize === 6 && moves === 18) updateProgress('perfect_6x6', 1);
            
            if (gridSize === 4) updateProgress('win_4x4_game', 1);
            if (gridSize === 6) updateProgress('win_6x6_game', 1);
            
            if (gameMode === 'time-attack') updateProgress('win_time_attack', 1);
            if (gameMode === 'classic') updateProgress('win_classic_game', 1);
            if (theme === 'ai-magic') updateProgress('play_ai_game', 1);
            
            return newState;
        });
    }, [dailyMissionIds]);

    const claimMissionReward = useCallback((missionId: string) => {
        const missionDef = MISSION_POOL.find(m => m.id === missionId);
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
             setMissionState(prev => {
                const newState: MissionState = JSON.parse(JSON.stringify(prev));
                const updateProgress = (id: string, amount: number) => {
                    const missionDef = MISSION_POOL.find(m => m.id === id);
                    if (!missionDef || !dailyMissionIds.includes(id)) return;
                    const mission = newState[id] || { progress: 0, isClaimed: false };
                    if (!mission.isClaimed) {
                        mission.progress = Math.min((mission.progress || 0) + amount, missionDef.goal);
                        newState[id] = mission;
                    }
                };
                updateProgress('buy_1_powerup', 1);
                return newState;
            });
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
    }, [coins, toast, inventory, dailyMissionIds]);

    const usePowerup = useCallback((id: PowerUp['id']) => {
        if (powerups[id] > 0) {
            setPowerups(prev => ({ ...prev, [id]: prev[id] - 1 }));

            setMissionState(prev => {
                const newState: MissionState = JSON.parse(JSON.stringify(prev));
                 const updateProgress = (id: string, amount: number) => {
                    const missionDef = MISSION_POOL.find(m => m.id === id);
                    if (!missionDef || !dailyMissionIds.includes(id)) return;
                    const mission = newState[id] || { progress: 0, isClaimed: false };
                    if (!mission.isClaimed) {
                        mission.progress = Math.min((mission.progress || 0) + amount, missionDef.goal);
                        newState[id] = mission;
                    }
                };
                
                updateProgress('use_3_powerups', 1);
                updateProgress('use_5_powerups', 1);

                return newState;
            });
            return true;
        }
        return false;
    }, [powerups, dailyMissionIds]);

    const value = { coins, powerups, inventory, missions, purchaseItem, usePowerup, logGameWin, claimMissionReward };

    return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};
