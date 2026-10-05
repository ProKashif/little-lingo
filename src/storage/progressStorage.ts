import type { CategoryId, Progress } from '@/types';
import { isRecord, readJson, removeKey, STORAGE_KEYS, writeJson } from './jsonStorage';

export const EMPTY_PROGRESS: Progress = {
  learnedItems: [],
  completedCategories: [],
  stars: 0,
  badges: [],
  currentStreak: 0,
  lastActiveDay: null,
  learningTimeSeconds: 0,
  categoryVisits: {},
  gameCorrectAnswers: 0,
};

const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];

const count = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;

/**
 * Accepts whatever is on disk and returns a valid Progress. Unknown or missing
 * fields fall back to defaults, so older saves keep working as the shape grows.
 */
function parseProgress(value: unknown): Progress {
  if (!isRecord(value)) return EMPTY_PROGRESS;

  const visits: Partial<Record<CategoryId, number>> = {};
  if (isRecord(value.categoryVisits)) {
    for (const [category, visitCount] of Object.entries(value.categoryVisits)) {
      visits[category as CategoryId] = count(visitCount);
    }
  }

  return {
    learnedItems: stringArray(value.learnedItems),
    completedCategories: stringArray(value.completedCategories) as CategoryId[],
    stars: count(value.stars),
    badges: stringArray(value.badges),
    currentStreak: count(value.currentStreak),
    lastActiveDay: typeof value.lastActiveDay === 'string' ? value.lastActiveDay : null,
    learningTimeSeconds: count(value.learningTimeSeconds),
    categoryVisits: visits,
    gameCorrectAnswers: count(value.gameCorrectAnswers),
  };
}

export async function getProgress(): Promise<Progress> {
  return parseProgress(await readJson(STORAGE_KEYS.progress));
}

export async function saveProgress(progress: Progress): Promise<void> {
  await writeJson(STORAGE_KEYS.progress, progress);
}

export async function clearProgress(): Promise<void> {
  await removeKey(STORAGE_KEYS.progress);
}
