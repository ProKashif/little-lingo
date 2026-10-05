import type { Translations } from './language';
import type { CategoryId } from './vocabulary';

export interface Progress {
  learnedItems: string[];
  completedCategories: CategoryId[];
  stars: number;
  badges: string[];
  currentStreak: number;
  /** Local calendar day (YYYY-MM-DD) of the last learning activity, for the streak. */
  lastActiveDay: string | null;
  learningTimeSeconds: number;
  /** How often each category was opened — drives "favourite categories". */
  categoryVisits: Partial<Record<CategoryId, number>>;
  gameCorrectAnswers: number;
}

export interface Settings {
  voiceEnabled: boolean;
  soundEffectsEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface Badge {
  id: string;
  emoji: string;
  name: Translations;
  isEarned: (progress: Progress) => boolean;
}
