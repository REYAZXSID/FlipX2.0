import type { LucideIcon } from "lucide-react";
import { Zap, HeartPulse, Eye } from "lucide-react";

export type Card = {
  type: string;
  content: string;
  image: boolean;
  hint?: string;
};

export type GameSettings = {
  gridSize: number;
  theme: string;
  sound: boolean;
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
};

export type CardBack = {
  id: string;
  name: string;
  className: string;
  cost: number;
  type: 'free' | 'premium';
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
]

export const GRID_SIZES = [
  { value: 2, label: '2x2 (Easy)' },
  { value: 4, label: '4x4 (Medium)' },
  { value: 6, label: '6x6 (Hard)' },
];

export const POWERUPS: PowerUp[] = [
    { id: 'autoMatch', name: 'Auto Match', description: 'Instantly matches one random pair.', Icon: Zap, cost: 25 },
    { id: 'secondChance', name: 'Second Chance', description: 'Take another turn after a mismatch.', Icon: HeartPulse, cost: 40 },
    { id: 'xrayVision', name: 'X-Ray Vision', description: 'Briefly peek at a face-down card.', Icon: Eye, cost: 15 },
]

export const CARD_BACKS: CardBack[] = [
  { id: 'default', name: 'Default', className: 'card-back-default', cost: 0, type: 'free' },
  { id: 'galaxy', name: 'Galaxy', className: 'card-back-galaxy', cost: 100, type: 'premium' },
  { id: 'circuit', name: 'Circuit', className: 'card-back-circuit', cost: 150, type: 'premium' },
  { id: 'carbon', name: 'Carbon Fiber', className: 'card-back-carbon', cost: 200, type: 'premium' },
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
  space: {
    name: 'space',
    label: 'Space (AI Images)',
    items: ['planet', 'rocket', 'astronaut', 'galaxy', 'stars', 'comet', 'ufo', 'moon', 'sun', 'alien', 'telescope', 'satellite', 'nebula', 'black hole', 'constellation', 'meteor', 'spaceship', 'earth from space'],
    image: true,
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

export const DEFAULT_SETTINGS: Omit<GameSettings, 'sound'> = {
  gridSize: 4,
  theme: 'emojis',
  customTheme: '',
  gameMode: 'classic',
  cardBack: 'default',
};

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'flipfun-settings',
  HIGH_SCORES: 'flipfun-high-scores',
  ACHIEVEMENTS: 'flipfun-achievements',
  COINS: 'flipfun-coins',
  POWERUPS: 'flipfun-powerups',
  INVENTORY: 'flipfun-inventory',
};


function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function createCardSet(gridSize: number, themeName: string): Card[] {
  const numPairs = (gridSize * gridSize) / 2;
  const theme = THEMES[themeName as keyof typeof THEMES] || THEMES.emojis;

  if (theme.name === 'ai-magic') {
    return []; // AI cards are generated separately
  }

  const selectedItems = shuffleArray(theme.items).slice(0, numPairs);
  
  const cardPairs: Card[] = selectedItems.flatMap(item => {
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

  return shuffleArray(cardPairs);
}
