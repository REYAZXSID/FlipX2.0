
import type { LucideIcon } from "lucide-react";
import { Coins, Trophy, Zap, BrainCircuit, Bomb, Crown, Rocket, ShoppingCart, Sparkles } from "lucide-react";

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
        id: 'win_1_game',
        title: 'First of the Day',
        description: 'Win 1 game on any mode or difficulty.',
        difficulty: 'Easy',
        reward: 15,
        goal: 1,
        Icon: Trophy,
    },
    {
        id: 'win_3_games',
        title: 'Daily Warm-up',
        description: 'Win 3 games on any mode or difficulty.',
        difficulty: 'Medium',
        reward: 40,
        goal: 3,
        Icon: Trophy,
    },
     {
        id: 'win_5_games',
        title: 'Game Enthusiast',
        description: 'Win 5 games in total.',
        difficulty: 'Hard',
        reward: 100,
        goal: 5,
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
        id: 'use_5_powerups',
        title: 'Strategist',
        description: 'Use a total of 5 power-ups.',
        difficulty: 'Hard',
        reward: 80,
        goal: 5,
        Icon: Zap,
    },
    {
        id: 'earn_50_coins',
        title: 'Coin Starter',
        description: 'Earn 50 coins from playing games.',
        difficulty: 'Easy',
        reward: 20,
        goal: 50,
        Icon: Coins,
    },
    {
        id: 'earn_100_coins',
        title: 'Coin Collector',
        description: 'Earn 100 coins from playing games.',
        difficulty: 'Medium',
        reward: 75,
        goal: 100,
        Icon: Coins,
    },
    {
        id: 'earn_200_coins',
        title: 'Coin Magnet',
        description: 'Earn 200 coins from playing games.',
        difficulty: 'Hard',
        reward: 150,
        goal: 200,
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
        id: 'perfect_2x2',
        title: 'Perfect Start',
        description: 'Win a 2x2 game with only 2 moves.',
        difficulty: 'Easy',
        reward: 30,
        goal: 1,
        Icon: Crown,
    },
    {
        id: 'perfect_4x4',
        title: 'Flawless Victory',
        description: 'Win a 4x4 game with only 8 moves.',
        difficulty: 'Hard',
        reward: 100,
        goal: 1,
        Icon: Crown,
    },
    {
        id: 'perfect_6x6',
        title: 'Grandmaster',
        description: 'Win a 6x6 game with only 18 moves.',
        difficulty: 'Hard',
        reward: 200,
        goal: 1,
        Icon: Rocket,
    },
    {
        id: 'win_classic_game',
        title: 'Classic Player',
        description: 'Win a game in Classic mode.',
        difficulty: 'Easy',
        reward: 15,
        goal: 1,
        Icon: Trophy,
    },
     {
        id: 'win_4x4_game',
        title: 'Medium Challenge',
        description: 'Win a 4x4 game.',
        difficulty: 'Easy',
        reward: 20,
        goal: 1,
        Icon: BrainCircuit,
    },
    {
        id: 'buy_1_powerup',
        title: 'Shop Spree',
        description: 'Buy any power-up from the shop.',
        difficulty: 'Easy',
        reward: 15,
        goal: 1,
        Icon: ShoppingCart,
    },
    {
        id: 'play_ai_game',
        title: 'Creative Play',
        description: 'Play a game with a custom AI-generated theme.',
        difficulty: 'Medium',
        reward: 30,
        goal: 1,
        Icon: Sparkles,
    },
];

export type MissionState = {
    [missionId: string]: {
        progress: number;
        isClaimed: boolean;
    };
};
