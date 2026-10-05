import { BADGES } from '@/data/badges';
import { CATEGORIES } from '@/data/categories';
import { getItem, getItemsByCategory } from '@/data/vocabulary';
import { EMPTY_PROGRESS } from '@/storage';
import type { CategoryId, Progress } from '@/types';
import { localDay, previousDay } from '@/utils/date';

export type ProgressAction =
  | { type: 'hydrate'; progress: Progress }
  | { type: 'markLearned'; itemId: string; today: string }
  | { type: 'addStars'; amount: number }
  | { type: 'gameCorrect'; today: string }
  | { type: 'visitCategory'; category: CategoryId }
  | { type: 'addLearningTime'; seconds: number }
  | { type: 'reset' };

export function isCategoryComplete(category: CategoryId, learned: ReadonlySet<string>): boolean {
  const items = getItemsByCategory(category);
  return items.length > 0 && items.every((item) => learned.has(item.id));
}

function touchStreak(progress: Progress, today: string): Progress {
  if (progress.lastActiveDay === today) return progress;
  const continues = progress.lastActiveDay === previousDay(today);
  return {
    ...progress,
    lastActiveDay: today,
    currentStreak: continues ? progress.currentStreak + 1 : 1,
  };
}

/** Recomputes the derived lists after any change, so they can never drift from the facts. */
function withDerived(progress: Progress): Progress {
  const learned = new Set(progress.learnedItems);
  const completedCategories = CATEGORIES.map((category) => category.id).filter((id) =>
    isCategoryComplete(id, learned),
  );
  const next = { ...progress, completedCategories };
  // Badges are kept once earned, even if the rule would no longer match.
  const badges = [
    ...progress.badges,
    ...BADGES.filter((badge) => !progress.badges.includes(badge.id) && badge.isEarned(next)).map(
      (badge) => badge.id,
    ),
  ];
  return { ...next, badges };
}

export function progressReducer(state: Progress, action: ProgressAction): Progress {
  switch (action.type) {
    case 'hydrate':
      return withDerived(action.progress);

    case 'markLearned': {
      if (!getItem(action.itemId) || state.learnedItems.includes(action.itemId)) {
        return touchStreak(state, action.today);
      }
      return withDerived(
        touchStreak(
          {
            ...state,
            learnedItems: [...state.learnedItems, action.itemId],
            stars: state.stars + 1,
          },
          action.today,
        ),
      );
    }

    case 'addStars':
      return withDerived({ ...state, stars: state.stars + Math.max(0, action.amount) });

    case 'gameCorrect':
      return withDerived(
        touchStreak(
          { ...state, gameCorrectAnswers: state.gameCorrectAnswers + 1, stars: state.stars + 1 },
          action.today,
        ),
      );

    case 'visitCategory':
      return {
        ...state,
        categoryVisits: {
          ...state.categoryVisits,
          [action.category]: (state.categoryVisits[action.category] ?? 0) + 1,
        },
      };

    case 'addLearningTime':
      return {
        ...state,
        learningTimeSeconds: state.learningTimeSeconds + Math.max(0, action.seconds),
      };

    case 'reset':
      return EMPTY_PROGRESS;
  }
}

/** The streak shown to people: a streak whose last day is before yesterday has lapsed. */
export function activeStreak(progress: Progress, today: string = localDay()): number {
  const { lastActiveDay, currentStreak } = progress;
  return lastActiveDay === today || lastActiveDay === previousDay(today) ? currentStreak : 0;
}
