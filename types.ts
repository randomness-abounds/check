
export type DragonType = 'fire' | 'water' | 'earth' | 'air' | 'void';

export type Mood = 'content' | 'eager' | 'hibernating' | 'sleeping';

export type DragonStage = 'egg' | 'baby' | 'teen' | 'adult' | 'ancient';

export type EvolutionType = 'time' | 'streak';

export interface EvolutionThresholds {
  baby: number;
  teen: number;
  adult: number;
  ancient?: number; // Optional, added for advanced evolution configuration
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: 'plan' | 'reflection' | 'chat' | 'milestone_complete' | 'insight';
  content: string;
  role: 'user' | 'ai' | 'system';
}

export interface Dragon {
  id: number;
  name: string;
  subtitle?: string; // The project name or goal (e.g., "Learn Spanish")
  isHabit?: boolean; // Whether this is a recurring daily habit
  type: DragonType;
  stage: DragonStage; 
  imageUrl?: string; // URL/Base64 of the dragon's current appearance
  lastFed: number; // Timestamp (Semantically: lastTrained)
  napStartedAt: number | null; // Timestamp if napping, null otherwise
  isNapping: boolean;
  totalFocusMinutes: number;
  currentStreak: number; // Current streak in days
  evolutionConfig: {
    type: EvolutionType;
    thresholds: EvolutionThresholds;
  };
  tasks: Task[]; // Persistent strategic milestones
  history: HistoryEntry[]; // Persistent conversation and event log
}

export interface FocusLog {
  id: string;
  dragonId: number;
  timestamp: number;
  durationMinutes: number;
  intention: string;
  reflection: string;
  completedTasks: string[]; // List of task titles completed
}

export interface AppState {
  userPoints: number;
  dragons: Dragon[];
  logs: FocusLog[];
}

export type ViewState = 'DASHBOARD' | 'DETAIL' | 'STORE';
