import type { CategoryId, Language, VocabularyItem } from '@/types';
import { getItemsByCategory } from './vocabulary';

export interface GameDefinition {
  id: 'find-item';
  emoji: string;
  /** Topics whose words are picturable nouns with a gender for every language. */
  categories: readonly CategoryId[];
  roundsPerSession: number;
  optionsPerRound: number;
}

export const FIND_IT: GameDefinition = {
  id: 'find-item',
  emoji: '🔍',
  categories: ['animals', 'food', 'vehicles', 'objects'],
  roundsPerSession: 8,
  optionsPerRound: 3,
};

export const GAMES: readonly GameDefinition[] = [FIND_IT];

export interface FindItRound {
  target: VocabularyItem;
  options: VocabularyItem[];
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

export function getFindItPool(category?: CategoryId): VocabularyItem[] {
  const categories = category ? [category] : FIND_IT.categories;
  return categories.flatMap((id) => getItemsByCategory(id));
}

/** Builds one round, never repeating the previous target so the game keeps moving. */
export function createFindItRound(
  pool: readonly VocabularyItem[],
  previousTargetId?: string,
  random: () => number = Math.random,
): FindItRound | null {
  const candidates = pool.filter((item) => item.id !== previousTargetId);
  if (candidates.length === 0 || pool.length < FIND_IT.optionsPerRound) return null;

  const target = candidates[Math.floor(random() * candidates.length)];
  if (!target) return null;

  const distractors = shuffle(
    pool.filter((item) => item.id !== target.id),
    random,
  ).slice(0, FIND_IT.optionsPerRound - 1);

  return { target, options: shuffle([target, ...distractors], random) };
}

export function findItQuestion(
  item: VocabularyItem,
  language: Language,
  whereIs: (word: string, gender?: 'm' | 'f') => string,
): string {
  return whereIs(item.translations[language], item.gender?.[language]);
}
