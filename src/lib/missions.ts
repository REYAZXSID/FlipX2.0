
import type { LucideIcon } from "lucide-react";
import { Coins, Trophy, Zap, BrainCircuit, Bomb, Crown } from "lucide-react";

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


// Expanded pool of all possible missions
export const MISSION_POOL: MissionDefinition[] = [
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
    {
        id: 'win_6x6_game',
        title: 'Mind Master',
        description: 'Win one 6x6 game.',
        difficulty: 'Medium',
        reward: 40,
        goal: 1,
        Icon: BrainCircuit,
    },
    {
        id: 'win_time_attack',
        title: 'Beat the Clock',
        description: 'Win a game in Time Attack mode.',
        difficulty: 'Medium',
        reward: 40,
        goal: 1,
        Icon: Bomb,
    },
    {
        id: 'perfect_4x4',
        title: 'Flawless Victory',
        description: 'Win a 4x4 game with only 8 moves.',
        difficulty: 'Hard',
        reward: 100,
        goal: 1,
        Icon: Crown,
    }
];

export type MissionState = {
    [missionId: string]: {
        progress: number;
        isClaimed: boolean;
    };
};
