
import { Dragon, DragonType, Mood, AppState, DragonStage, EvolutionThresholds } from '../types';
import { differenceInHours, differenceInCalendarDays } from 'date-fns';

// UPDATED FOR TESTING PURPOSES: 1 min intervals
export const DEFAULT_THRESHOLDS: EvolutionThresholds = {
  baby: 1,
  teen: 2,
  adult: 3,
  ancient: 4
};

export const DEFAULT_STREAK_THRESHOLDS: EvolutionThresholds = {
  baby: 3,
  teen: 7,
  adult: 21
};

export const INITIAL_STATE: AppState = {
  userPoints: 0,
  dragons: [
    { 
      id: 1, name: "Ignis", subtitle: "Q4 Financial Report", isHabit: false, type: "fire", stage: "egg", 
      lastFed: Date.now(), napStartedAt: null, isNapping: false, totalFocusMinutes: 0, currentStreak: 0,
      evolutionConfig: { type: 'time', thresholds: DEFAULT_THRESHOLDS },
      tasks: [], history: [], imageUrl: undefined
    },
    { 
      id: 2, name: "Aqua", subtitle: "Daily Meditation", isHabit: true, type: "water", stage: "egg", 
      lastFed: Date.now(), napStartedAt: null, isNapping: false, totalFocusMinutes: 0, currentStreak: 0,
      evolutionConfig: { type: 'streak', thresholds: DEFAULT_STREAK_THRESHOLDS },
      tasks: [], history: [], imageUrl: undefined
    },
    { 
      id: 3, name: "Terra", subtitle: "Garden Renovation", isHabit: false, type: "earth", stage: "egg", 
      lastFed: Date.now() - (25 * 60 * 60 * 1000), napStartedAt: null, isNapping: false, totalFocusMinutes: 0, currentStreak: 0,
      evolutionConfig: { type: 'time', thresholds: DEFAULT_THRESHOLDS },
      tasks: [], history: [], imageUrl: undefined
    },
  ],
  logs: []
};

// Only kept for backward compatibility if needed, but preferred to use dragon config
export const STAGE_THRESHOLDS = DEFAULT_THRESHOLDS;

export const calculateStage = (metric: number, thresholds: EvolutionThresholds): DragonStage => {
  if (thresholds.ancient && metric >= thresholds.ancient) return 'ancient';
  if (metric >= thresholds.adult) return 'adult';
  if (metric >= thresholds.teen) return 'teen';
  if (metric >= thresholds.baby) return 'baby';
  return 'egg';
};

export const getDragonStage = (dragon: Dragon): DragonStage => {
  // If explicitly set to ancient via manual override (legacy), keep it, unless config says otherwise
  if (dragon.stage === 'ancient' && (!dragon.evolutionConfig.thresholds.ancient)) return 'ancient'; 
  
  const thresholds = dragon.evolutionConfig?.thresholds || DEFAULT_THRESHOLDS;
  const metric = dragon.evolutionConfig?.type === 'streak' ? dragon.currentStreak : dragon.totalFocusMinutes;

  return calculateStage(metric, thresholds);
};

export const updateDragonStreak = (dragon: Dragon): number => {
  const lastFedDate = new Date(dragon.lastFed);
  const today = new Date();
  const diffDays = differenceInCalendarDays(today, lastFedDate);
  
  if (diffDays === 0) return dragon.currentStreak; // Already fed today
  if (diffDays === 1) return dragon.currentStreak + 1; // Consecutive day
  
  // If it's a new dragon (totalMinutes 0) allow starting streak at 1
  if (dragon.totalFocusMinutes === 0) return 1;

  return 1; // Streak broken, reset to 1 (today counts as 1)
};

export const getDragonMood = (dragon: Dragon): Mood => {
  if (dragon.isNapping) return 'sleeping';

  const hoursSinceFed = differenceInHours(Date.now(), dragon.lastFed);

  if (hoursSinceFed < 24) return 'content'; 
  if (hoursSinceFed < 168) return 'eager';   // 7 days window
  return 'hibernating';                      // Auto-hibernating
};

export const generateNewDragon = (id: number): Dragon => {
  const types: DragonType[] = ['air', 'void', 'fire', 'water', 'earth'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const names = ["Aether", "Zephyr", "Nyx", "Chaos", "Nova", "Flux", "Echo", "Mist", "Obsidian", "Sol"];
  const randomName = names[Math.floor(Math.random() * names.length)];

  return {
    id,
    name: randomName,
    subtitle: "New Quest",
    isHabit: false,
    type: randomType,
    stage: 'egg',
    lastFed: Date.now(),
    napStartedAt: null,
    isNapping: false,
    totalFocusMinutes: 0,
    currentStreak: 0,
    evolutionConfig: { type: 'time', thresholds: DEFAULT_THRESHOLDS },
    tasks: [],
    history: [],
    imageUrl: undefined
  };
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem('dragon_haven_data');
    if (!serialized) return INITIAL_STATE;
    const loaded = JSON.parse(serialized);
    
    // Basic structure check
    if (!loaded || !Array.isArray(loaded.dragons)) {
      return INITIAL_STATE;
    }

    // Ensure stages, tasks, and history are valid (handle migration from old data)
    const dragons = loaded.dragons.map((d: any) => ({
      ...d,
      stage: ['egg', 'baby', 'teen', 'adult', 'ancient'].includes(d.stage) ? d.stage : 'egg',
      tasks: Array.isArray(d.tasks) ? d.tasks : [],
      history: Array.isArray(d.history) ? d.history : [],
      subtitle: d.subtitle || "New Quest",
      isHabit: !!d.isHabit,
      currentStreak: typeof d.currentStreak === 'number' ? d.currentStreak : 0,
      evolutionConfig: d.evolutionConfig || { 
        type: d.isHabit ? 'streak' : 'time', 
        thresholds: d.isHabit ? DEFAULT_STREAK_THRESHOLDS : DEFAULT_THRESHOLDS 
      },
      imageUrl: d.imageUrl || undefined
    }));

    return { ...loaded, dragons };
  } catch (e) {
    console.error("Failed to load state", e);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem('dragon_haven_data', JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const getTypeColor = (type: DragonType): string => {
  switch (type) {
    case 'fire': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'water': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'earth': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    case 'air': return 'text-sky-300 bg-sky-300/10 border-sky-300/20';
    case 'void': return 'text-violet-500 bg-violet-500/10 border-violet-500/20';
    default: return 'text-slate-400 bg-slate-800 border-slate-700';
  }
};

export const getMoodColor = (mood: Mood): string => {
  switch (mood) {
    case 'content': return 'ring-emerald-500 shadow-emerald-500/20';
    case 'eager': return 'ring-amber-400 shadow-amber-400/20 animate-pulse';
    case 'hibernating': return 'ring-indigo-400 shadow-indigo-400/20 opacity-90 grayscale-[0.3]';
    case 'sleeping': return 'ring-indigo-400 shadow-indigo-400/20 opacity-90';
    default: return 'ring-slate-700';
  }
};
