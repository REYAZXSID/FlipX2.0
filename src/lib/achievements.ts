
import type { LucideIcon } from "lucide-react";
import { Award, Zap, BrainCircuit, Bot, Crown, Rocket, ShoppingCart, Bomb, LandMine } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from "./game-constants";

export type Achievement = {
  id: string;
  name: string;
  description: string;
  Icon: LucideIcon;
  reward: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game on any difficulty.',
    Icon: Award,
    reward: 25,
  },
  {
    id: 'perfect_4x4',
    name: 'Perfect Match',
    description: 'Win a 4x4 game with the minimum number of moves (8).',
    Icon: Crown,
    reward: 50,
  },
  {
    id: 'speed_demon_4x4',
    name: 'Speed Demon',
    description: 'Win a 4x4 game in under 30 seconds.',
    Icon: Zap,
    reward: 50,
  },
  {
    id: 'marathon_6x6',
    name: 'Memory Marathon',
    description: 'Complete a challenging 6x6 game.',
    Icon: BrainCircuit,
    reward: 75,
  },
  {
    id: 'perfect_6x6',
    name: 'Grandmaster',
    description: 'Win a 6x6 game with the minimum number of moves (18).',
    Icon: Rocket,
    reward: 150,
  },
  {
    id: 'ai_explorer',
    name: 'AI Explorer',
    description: 'Play a game with a custom AI-generated theme.',
    Icon: Bot,
    reward: 30,
  },
  {
    id: 'time_attacker',
    name: 'Time Attacker',
    description: 'Win a game in Time Attack mode.',
    Icon: Bomb,
    reward: 40,
  },
  {
    id: 'mine_sweeper',
    name: 'Mine Sweeper',
    description: 'Win a game in Minefield mode.',
    Icon: LandMine,
    reward: 50,
  },
  {
    id: 'shopper',
    name: 'First Purchase',
    description: 'Buy your first item from the shop.',
    Icon: ShoppingCart,
    reward: 10,
  },
];

type CheckAchievementsArgs = {
    moves: number;
    time: number;
    gridSize: number;
    theme: string;
    gameMode: string;
    isFirstWin: boolean;
};

export const checkAchievements = ({ moves, time, gridSize, theme, gameMode, isFirstWin }: CheckAchievementsArgs): Achievement[] => {
    const unlocked: Achievement[] = [];

    if (isFirstWin) {
        unlocked.push(ACHIEVEMENTS.find(a => a.id === 'first_win')!);
    }

    if (gridSize === 4 && moves === 8) {
        unlocked.push(ACHIEVEMENTS.find(a => a.id === 'perfect_4x4')!);
    }
    
    if (gridSize === 4 && time < 30) {
        unlocked.push(ACHIEVEMENTS.find(a => a.id === 'speed_demon_4x4')!);
    }
    
    if (gridSize === 6) {
        unlocked.push(ACHIEVEMENTS.find(a => a.id === 'marathon_6x6')!);
    }
    
    if (gridSize === 6 && moves === 18) {
        unlocked.push(ACHIEVEMENTS.find(a => a.id === 'perfect_6x6')!);
    }
    
    if (theme === 'ai-magic') {
        unlocked.push(ACHIEVEMENTS.find(a => a.id === 'ai_explorer')!);
    }
    
    if (gameMode === 'time-attack') {
        unlocked.push(ACHIEVEMENTS.find(a => a.id === 'time_attacker')!);
    }

    if (gameMode === 'minefield') {
      unlocked.push(ACHIEVEMENTS.find(a => a.id === 'mine_sweeper')!);
    }

    return unlocked;
}

// A separate check for the 'shopper' achievement. This is now a pure function.
export const checkShopAchievement = (): Achievement | null => {
    try {
        const achievements: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS) || '[]');
        if (!achievements.includes('shopper')) {
            return ACHIEVEMENTS.find(a => a.id === 'shopper')!;
        }
    } catch (e) {
        console.error("Failed to check shop achievement", e);
    }
    return null;
}
