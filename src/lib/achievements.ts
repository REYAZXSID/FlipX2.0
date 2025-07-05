import type { LucideIcon } from "lucide-react";
import { Award, Zap, BrainCircuit, Bot, Crown, Rocket } from 'lucide-react';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  Icon: LucideIcon;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game on any difficulty.',
    Icon: Award,
  },
  {
    id: 'perfect_4x4',
    name: 'Perfect Match',
    description: 'Win a 4x4 game with the minimum number of moves (8).',
    Icon: Crown,
  },
  {
    id: 'speed_demon_4x4',
    name: 'Speed Demon',
    description: 'Win a 4x4 game in under 30 seconds.',
    Icon: Zap,
  },
  {
    id: 'marathon_6x6',
    name: 'Memory Marathon',
    description: 'Complete a challenging 6x6 game.',
    Icon: BrainCircuit,
  },
  {
    id: 'perfect_6x6',
    name: 'Grandmaster',
    description: 'Win a 6x6 game with the minimum number of moves (18).',
    Icon: Rocket,
  },
  {
    id: 'ai_explorer',
    name: 'AI Explorer',
    description: 'Play a game with a custom AI-generated theme.',
    Icon: Bot,
  },
];

type CheckAchievementsArgs = {
    moves: number;
    time: number;
    gridSize: number;
    theme: string;
    isFirstWin: boolean;
};

export const checkAchievements = ({ moves, time, gridSize, theme, isFirstWin }: CheckAchievementsArgs): Achievement[] => {
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

    return unlocked;
}
