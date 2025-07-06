
import type { LucideIcon } from "lucide-react";
import { Zap, HeartPulse, Eye } from "lucide-react";
import { SoundThemeName } from "./sound-themes";

export type Card = {
  type: string;
  content: string;
  image: boolean;
  hint?: string;
  isBomb?: boolean;
};

export type GameSettings = {
  gridSize: number;
  theme: string;
  sound: boolean;
  soundTheme: SoundThemeName;
  customTheme?: string;
  gameMode: string;
  cardBack: string;
};

export type HighScore = {
  moves: number;
  time: number;
}

export type PowerUp = {
  id: 'autoMatch' | 'secondChance' | 'xrayVision';
  name:string;
  description: string;
  Icon: LucideIcon;
  cost: number;
  type: 'powerup';
};

export type CardBack = {
  id: string;
  name: string;
  className: string;
  themeBackgroundClass?: string;
  cost: number;
  type: 'free' | 'premium';
}

export type CustomCardBack = {
    id: string;
    name: string;
    cost: number;
    content: string;
    className: string;
    type: 'ai-premium';
}

export type GameStats = {
    gamesPlayed: number;
    wins: number;
    totalMoves: number;
    totalTime: number;
    themePlays: { [theme: string]: number };
}

export const GAME_STATUS = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
  LOST: 'lost',
};

export const GAME_MODES = [
    { id: 'classic', label: 'Classic' },
    { id: 'time-attack', label: 'Time Attack' },
    { id: 'minefield', label: 'Minefield' },
    { id: 'sudden-death', label: 'Sudden Death' },
    { id: 'peekaboo', label: 'Peekaboo' },
    { id: 'scramble', label: 'Scramble' },
]

export const GRID_SIZES = [
  { value: 2, label: '2x2 (Easy)' },
  { value: 4, label: '4x4 (Medium)' },
  { value: 6, label: '6x6 (Hard)' },
];

export const POWERUPS: PowerUp[] = [
    { id: 'autoMatch', name: 'Auto Match', description: 'Instantly matches one random pair.', Icon: Zap, cost: 25, type: 'powerup' },
    { id: 'secondChance', name: 'Second Chance', description: 'Take another turn after a mismatch.', Icon: HeartPulse, cost: 40, type: 'powerup' },
    { id: 'xrayVision', name: 'X-Ray Vision', description: 'Briefly peek at a face-down card.', Icon: Eye, cost: 15, type: 'powerup' },
]

export const CARD_BACKS: CardBack[] = [
  { id: 'default', name: 'Default', className: 'card-back-default', themeBackgroundClass: 'theme-bg-default', cost: 0, type: 'free' },
  { id: 'galaxy', name: 'Galaxy', className: 'card-back-galaxy', themeBackgroundClass: 'theme-bg-galaxy', cost: 100, type: 'premium' },
  { id: 'circuit', name: 'Circuit', className: 'card-back-circuit', themeBackgroundClass: 'theme-bg-circuit', cost: 150, type: 'premium' },
  { id: 'carbon', name: 'Carbon Fiber', className: 'card-back-carbon', themeBackgroundClass: 'theme-bg-carbon', cost: 200, type: 'premium' },
]

export const THEMES = {
  'ai-magic': {
    name: 'ai-magic',
    label: '✨ AI Magic',
    items: [],
    image: true,
  },
  emojis: {
    name: 'emojis',
    label: 'Emojis',
    items: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'],
    image: false,
  },
  flags: {
    name: 'flags',
    label: 'Country Flags',
    items: ['🇺🇸', '🇨🇦', '🇲🇽', '🇧🇷', '🇦🇷', '🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸', '🇵🇹', '🇯🇵', '🇨🇳', '🇰🇷', '🇦🇺', '🇮🇳', '🇷🇺', '🇿🇦'],
    image: false,
  },
  letters: {
    name: 'letters',
    label: 'Letters',
    items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
    image: false,
  }
};

export const DEFAULT_SETTINGS: GameSettings = {
  gridSize: 4,
  theme: 'emojis',
  customTheme: '',
  gameMode: 'classic',
  cardBack: 'default',
  sound: true,
  soundTheme: 'default',
};

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'flipfun-settings-v2',
  HIGH_SCORES: 'flipfun-high-scores-v2',
  ACHIEVEMENTS: 'flipfun-achievements-v2',
  COINS: 'flipfun-coins-v2',
  POWERUPS: 'flipfun-powerups-v2',
  INVENTORY: 'flipfun-inventory-v2',
  CUSTOM_CARD_BACKS: 'flipfun-custom-card-backs-v2',
  SOUND_THEME_INVENTORY: 'flipfun-sound-theme-inventory-v2',
  STATS: 'flipfun-stats-v2',
  MISSIONS: 'flipfun-missions-v2',
  DAILY_MISSION_IDS: 'flipfun-daily-mission-ids-v2',
  MISSIONS_RESET_DATE: 'flipfun-missions-reset-date-v2',
  PLAYER_NAME: 'flipfun-player-name-v2',
};


function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function createCardSet(gridSize: number, themeName: string, gameMode: string): Card[] {
  const numPairs = (gridSize * gridSize) / 2;
  const theme = THEMES[themeName as keyof typeof THEMES] || THEMES.emojis;

  if (theme.name === 'ai-magic') {
    return []; // AI cards are generated separately
  }

  const selectedItems = shuffleArray(theme.items).slice(0, numPairs);
  
  let cardPairs: Card[] = selectedItems.flatMap(item => {
    if (theme.image) {
      return [
        { type: item, content: `https://placehold.co/200x200.png`, image: true, hint: item.replace(/\s+/g, ' ') },
        { type: item, content: `https://placehold.co/200x200.png`, image: true, hint: item.replace(/\s+/g, ' ') },
      ];
    }
    return [
      { type: item, content: item, image: false },
      { type: item, content: item, image: false },
    ];
  });

  if (gameMode === 'minefield' && cardPairs.length > 0) {
    const bombCount = gridSize <= 2 ? 0 : (gridSize === 4 ? 1 : 2);
    if (bombCount > 0) {
      const typesToBomb = shuffleArray(selectedItems).slice(0, bombCount);
      cardPairs.forEach(card => {
        if (typesToBomb.includes(card.type)) {
          card.isBomb = true;
        }
      });
    }
  }

  return shuffleArray(cardPairs);
}
