import { useMemo } from 'react';
import { CATEGORIES } from '@/data/categories';
import { getItemsByCategory } from '@/data/vocabulary';
import { useProgress } from '@/context';
import type { CategoryId } from '@/types';

export interface CategoryProgress {
  learned: number;
  total: number;
}

/** Learned/total per category, recomputed only when the learned list changes. */
export function useCategoryProgress(): Record<CategoryId, CategoryProgress> {
  const { progress } = useProgress();
  const { learnedItems } = progress;

  return useMemo(() => {
    const learned = new Set(learnedItems);
    return Object.fromEntries(
      CATEGORIES.map((category) => {
        const items = getItemsByCategory(category.id);
        return [
          category.id,
          { learned: items.filter((item) => learned.has(item.id)).length, total: items.length },
        ];
      }),
    ) as Record<CategoryId, CategoryProgress>;
  }, [learnedItems]);
}
