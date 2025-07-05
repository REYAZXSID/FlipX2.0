export type Card = {
  type: string;
  content: string;
  image: boolean;
};

export type GameSettings = {
  gridSize: number;
  theme: string;
  sound: boolean;
};

export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
};

export const GRID_SIZES = [
  { value: 2, label: '2x2 (Easy)' },
  { value: 4, label: '4x4 (Medium)' },
  { value: 6, label: '6x6 (Hard)' },
];

export const THEMES = {
  emojis: {
    name: 'emojis',
    label: 'Emojis',
    items: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'],
    image: false,
  },
  animals: {
    name: 'animals',
    label: 'Animals',
    items: ['🐘', '🦒', '🦓', '🦏', ' Hippo', '🐅', '🐆', '🐊', '🐍', '🐢', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦀', '🐡'],
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
  sound: true,
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

  const selectedItems = shuffleArray(theme.items).slice(0, numPairs);
  
  const cardPairs: Card[] = selectedItems.flatMap(item => [
    { type: item, content: item, image: theme.image },
    { type: item, content: item, image: theme.image },
  ]);

  return shuffleArray(cardPairs);
}
