
'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { LOCAL_STORAGE_KEYS, type PowerUp, type CardBack, type GameStats, type CustomCardBack } from '@/lib/game-constants';
import type { SoundTheme } from '@/lib/sound-themes';
import { checkShopAchievement, type Achievement } from '@/lib/achievements';
import { useToast } from '@/hooks/use-toast';
import { MISSION_POOL, type Mission, type MissionState, type MissionDefinition } from '@/lib/missions';


export interface UserDataContextType {
    coins: number;
    username: string;
    powerups: Record<string, number>;
    inventory: string[];
    customCardBacks: CustomCardBack[];
    soundThemeInventory: string[];
    stats: GameStats;
    missions: Mission[];
    purchaseItem: (item: PowerUp | CardBack | SoundTheme | CustomCardBack) => boolean;
    usePowerup: (id: PowerUp['id']) => boolean;
    logGameWin: (args: { coinsEarned: number; gridSize: number; moves: number; gameMode: string; theme: string; }) => void;
    claimMissionReward: (missionId: string) => void;
    setUsername: (name: string) => void;
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
const defaultUsername = 'Player';
const defaultPowerups: Record<string, number> = { autoMatch: 1, secondChance: 0, xrayVision: 2 };
const defaultInventory: string[] = ['default'];
const defaultCustomCardBacks: CustomCardBack[] = [];
const defaultSoundThemeInventory: string[] = ['default'];
const defaultStats: GameStats = { gamesPlayed: 0, wins: 0, totalMoves: 0, totalTime: 0, themePlays: {} };
const defaultMissions: MissionState = {};

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const [coins, setCoins] = useState<number>(defaultCoins);
    const [username, setUsername] = useState<string>(defaultUsername);
    const [powerups, setPowerups] = useState<Record<string, number>>(defaultPowerups);
    const [inventory, setInventory] = useState<string[]>(defaultInventory);
    const [customCardBacks, setCustomCardBacks] = useState<CustomCardBack[]>(defaultCustomCardBacks);
    const [soundThemeInventory, setSoundThemeInventory] = useState<string[]>(defaultSoundThemeInventory);
    const [stats, setStats] = useState<GameStats>(defaultStats);
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
        setUsername(getInitialData(LOCAL_STORAGE_KEYS.PLAYER_NAME, defaultUsername));
        setPowerups(getInitialData(LOCAL_STORAGE_KEYS.POWERUPS, defaultPowerups));
        setInventory(getInitialData(LOCAL_STORAGE_KEYS.INVENTORY, defaultInventory));
        setCustomCardBacks(getInitialData(LOCAL_STORAGE_KEYS.CUSTOM_CARD_BACKS, defaultCustomCardBacks));
        setSoundThemeInventory(getInitialData(LOCAL_STORAGE_KEYS.SOUND_THEME_INVENTORY, defaultSoundThemeInventory));
        setStats(getInitialData(LOCAL_STORAGE_KEYS.STATS, defaultStats));
        setMissionState(getInitialData(LOCAL_STORAGE_KEYS.MISSIONS, defaultMissions));
        setIsLoaded(true);
    }, []);

    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.COINS, JSON.stringify(coins)); }, [coins, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.PLAYER_NAME, JSON.stringify(username)); }, [username, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.POWERUPS, JSON.stringify(powerups)); }, [powerups, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.INVENTORY, JSON.stringify(inventory)); }, [inventory, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOM_CARD_BACKS, JSON.stringify(customCardBacks)); }, [customCardBacks, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.SOUND_THEME_INVENTORY, JSON.stringify(soundThemeInventory)); }, [soundThemeInventory, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.STATS, JSON.stringify(stats)); }, [stats, isLoaded]);
    useEffect(() => { if (isLoaded) localStorage.setItem(LOCAL_STORAGE_KEYS.MISSIONS, JSON.stringify(missionState)); }, [missionState, isLoaded]);


    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
           if (event.key === LOCAL_STORAGE_KEYS.COINS) setCoins(getInitialData(LOCAL_STORAGE_KEYS.COINS, defaultCoins));
           if (event.key === LOCAL_STORAGE_KEYS.PLAYER_NAME) setUsername(getInitialData(LOCAL_STORAGE_KEYS.PLAYER_NAME, defaultUsername));
           if (event.key === LOCAL_STORAGE_KEYS.POWERUPS) setPowerups(getInitialData(LOCAL_STORAGE_KEYS.POWERUPS, defaultPowerups));
           if (event.key === LOCAL_STORAGE_KEYS.INVENTORY) setInventory(getInitialData(LOCAL_STORAGE_KEYS.INVENTORY, defaultInventory));
            if (event.key === LOCAL_STORAGE_KEYS.CUSTOM_CARD_BACKS) setCustomCardBacks(getInitialData(LOCAL_STORAGE_KEYS.CUSTOM_CARD_BACKS, defaultCustomCardBacks));
            if (event.key === LOCAL_STORAGE_KEYS.SOUND_THEME_INVENTORY) setSoundThemeInventory(getInitialData(LOCAL_STORAGE_KEYS.SOUND_THEME_INVENTORY, defaultSoundThemeInventory));
            if (event.key === LOCAL_STORAGE_KEYS.STATS) setStats(getInitialData(LOCAL_STORAGE_KEYS.STATS, defaultStats));
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
        setCoins(prev => prev + coinsEarned);
        
        setStats(prev => ({
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            wins: prev.wins + 1,
            totalMoves: prev.totalMoves + moves,
            themePlays: {
                ...prev.themePlays,
                [theme]: (prev.themePlays[theme] || 0) + 1,
            }
        }));

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
            if (gameMode === 'sudden-death') updateProgress('win_sudden_death', 1);
            if (gameMode === 'peekaboo') updateProgress('win_peekaboo', 1);
            if (gameMode === 'scramble') updateProgress('win_scramble', 1);
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

    const purchaseItem = useCallback((item: PowerUp | CardBack | SoundTheme | CustomCardBack) => {
        if (coins < item.cost) {
            toast({ variant: 'destructive', title: 'Not enough coins!', description: `You need ${item.cost - coins} more coins.` });
            return false;
        }

        const isOwned = inventory.includes(item.id) || soundThemeInventory.includes(item.id);
        if (item.type !== 'powerup' && item.type !== 'ai-premium' && isOwned) {
            toast({ title: 'Already Owned', description: `You already own the ${item.name}.` });
            return false;
        }

        setCoins(prev => prev - item.cost);

        if (item.type === 'powerup') {
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
        } else if (item.type === 'sound-theme') {
            setSoundThemeInventory(prev => [...prev, item.id]);
        } else if (item.type === 'ai-premium') {
            setCustomCardBacks(prev => [...prev, item]);
        } else { // standard card back
            setInventory(prev => [...prev, item.id]);
        }

        const newAchievement = checkShopAchievement();
        if (newAchievement) {
            try {
                const existingAchievements: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS) || '[]');
                if (!existingAchievements.includes(newAchievement.id)) {
                    const allUnlocked = [...existingAchievements, newAchievement.id];
                    localStorage.setItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(allUnlocked));
                    
                    setCoins(prev => prev + newAchievement.reward);
                    toast({ title: 'Achievement Unlocked!', description: `${newAchievement.name}: ${newAchievement.description} You earned ${newAchievement.reward} coins!` });

                    window.dispatchEvent(new Event('storage'));
                }
            } catch (e) { console.error("Failed to save shop achievement", e); }
        }
        
        toast({ title: 'Purchase Successful!', description: `You bought ${item.name}.` });
        return true;
    }, [coins, toast, inventory, soundThemeInventory, dailyMissionIds]);

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

    const value = { coins, username, setUsername, powerups, inventory, customCardBacks, soundThemeInventory, stats, missions, purchaseItem, usePowerup, logGameWin, claimMissionReward };

    return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};
