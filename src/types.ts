export type Suit = 'oros' | 'copas' | 'espadas' | 'bastos';

export type Language = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ru' | 'ja';

export type TableTheme = 'classic' | 'royal' | 'velvet' | 'midnight' | 'woodland';

export interface Card {
  id: string;
  suit: Suit;
  number: number; // 1 to 7, 10, 11, 12 (or 13 for Joker)
  isJoker?: boolean;
  points: number; // 1 for 1, 2-7 for face, 10 for 10/11/12, 25 for Joker
}

export type MeldType = 'trio' | 'cuarteto' | 'escalera' | 'chinchon';

export interface Meld {
  id: string;
  type: MeldType;
  cards: Card[];
  suit?: Suit;
  number?: number;
}

export interface HandAnalysis {
  melds: Meld[];
  unmatchedCards: Card[];
  unmatchedPoints: number;
  canClose: boolean;
  isCleanClose: boolean; // 0 unmatched points
  isChinchon: boolean;   // 7-card run same suit without joker
}

export type GamePhase = 
  | 'idle'           // Before game start
  | 'dealing'        // Dealing animation
  | 'player_draw'    // Player's turn: must draw from mazo or pozo
  | 'player_discard' // Player's turn: must discard or close
  | 'ai_thinking'    // AI turn
  | 'round_end'      // Round finished, showing melds & scores
  | 'game_over';     // Game finished, match winner declared

export interface PlayerStats {
  turnsPlayed: number;
  totalTimeMs: number;
  fastTurnsCount: number; // turns < 2.5 seconds
  averageTimeMs: number;
  chinchonsCount: number;
  cleanClosesCount: number;
  wins: number;
  losses: number;
}

export interface RoundScore {
  roundNumber: number;
  playerPointsAdded: number;
  aiPointsAdded: number;
  playerTotal: number;
  aiTotal: number;
  closedBy: 'player' | 'ai';
  notes?: string;
}

export interface Achievement {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface GameSettings {
  language: Language;
  theme: TableTheme;
  maxPoints: number; // 100, 50, 150
  includeJokers: boolean;
  closeThreshold: number; // max unmatched points to close (e.g. 5)
  aiDifficulty: 'easy' | 'normal' | 'pro' | 'master';
  sfxVolume: number; // 0 to 1
  ambientVolume: number; // 0 to 1
  ambientType: 'none' | 'fireside' | 'rain' | 'lounge' | 'breeze';
  autoSortHand: boolean;
}
