
import type { LucideIcon } from "lucide-react";
import { Coins, Trophy, Zap } from "lucide-react";

export type MissionDifficulty = 'Easy' | 'Medium' | 'Hard';

export type MissionDefinition = {
  id: string;
  title: string;
  description: string;
  difficulty: MissionDifficulty;
  reward: number;
  goal: number;
  Icon: LucideIcon;
};

export type Mission = MissionDefinition & {
  progress: number;
  isClaimed: boolean;
};


// For this prototype, we'll use a static list.
// In a real app, this would be generated daily.
export const DAILY_MISSIONS: MissionDefinition[] = [
    {
        id: 'win_3_games',
        title: 'Daily Warm-up',
        description: 'Win 3 games on any mode or difficulty.',
        difficulty: 'Easy',
        reward: 25,
        goal: 3,
        Icon: Trophy,
    },
    {
        id: 'use_3_powerups',
        title: 'Power User',
        description: 'Use a total of 3 power-ups.',
        difficulty: 'Medium',
        reward: 50,
        goal: 3,
        Icon: Zap,
    },
    {
        id: 'earn_100_coins',
        title: 'Coin Collector',
        description: 'Earn 100 coins from playing games.',
        difficulty: 'Hard',
        reward: 75,
        goal: 100,
        Icon: Coins,
    },
];

export type MissionState = {
    [missionId: string]: {
        progress: number;
        isClaimed: boolean;
    };
};
