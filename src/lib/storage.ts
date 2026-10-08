import { Achievement, GameSettings, PlayerStats } from '../types';

const SETTINGS_KEY = 'chinchon_settings_v1';
const STATS_KEY = 'chinchon_stats_v1';
const ACHIEVEMENTS_KEY = 'chinchon_achievements_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  language: 'es',
  theme: 'classic',
  maxPoints: 100,
  includeJokers: true,
  closeThreshold: 5,
  aiDifficulty: 'normal',
  sfxVolume: 0.8,
  ambientVolume: 0.4,
  ambientType: 'fireside',
  autoSortHand: true,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    icon: '🎴',
    titleKey: 'achiv_first_win_title',
    descKey: 'achiv_first_win_desc',
    unlocked: false,
  },
  {
    id: 'chinchon_master',
    icon: '🐉',
    titleKey: 'achiv_chinchon_title',
    descKey: 'achiv_chinchon_desc',
    unlocked: false,
  },
  {
    id: 'speed_demon',
    icon: '⚡',
    titleKey: 'achiv_speed_title',
    descKey: 'achiv_speed_desc',
    unlocked: false,
  },
  {
    id: 'clean_close',
    icon: '🧼',
    titleKey: 'achiv_clean_title',
    descKey: 'achiv_clean_desc',
    unlocked: false,
  },
  {
    id: 'ai_crusher',
    icon: '🧠',
    titleKey: 'achiv_ai_title',
    descKey: 'achiv_ai_desc',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'trio_collector',
    icon: '🎯',
    titleKey: 'achiv_trio_title',
    descKey: 'achiv_trio_desc',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'run_lover',
    icon: '🏃',
    titleKey: 'achiv_run_title',
    descKey: 'achiv_run_desc',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'rules_scholar',
    icon: '🎓',
    titleKey: 'achiv_rules_title',
    descKey: 'achiv_rules_desc',
    unlocked: false,
  },
];

export const INITIAL_STATS: PlayerStats = {
  turnsPlayed: 0,
  totalTimeMs: 0,
  fastTurnsCount: 0,
  averageTimeMs: 0,
  chinchonsCount: 0,
  cleanClosesCount: 0,
  wins: 0,
  losses: 0,
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return { ...INITIAL_STATS, ...JSON.parse(raw) };
  } catch {
    // fallback
  }
  return INITIAL_STATS;
}

export function saveStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw) {
      const saved: Achievement[] = JSON.parse(raw);
      return INITIAL_ACHIEVEMENTS.map(initial => {
        const found = saved.find(s => s.id === initial.id);
        return found ? { ...initial, ...found } : initial;
      });
    }
  } catch {
    // fallback
  }
  return INITIAL_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // ignore
  }
}
