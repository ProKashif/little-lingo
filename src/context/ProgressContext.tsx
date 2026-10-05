import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { getItem } from '@/data/vocabulary';
import { clearProgress, EMPTY_PROGRESS, getProgress, saveProgress } from '@/storage';
import type { CategoryId, Progress } from '@/types';
import { localDay } from '@/utils/date';
import { progressReducer } from './progressReducer';

export interface LearnResult {
  isNew: boolean;
}

export type Celebration = { kind: 'badge'; id: string } | { kind: 'category'; id: CategoryId };

interface ProgressActions {
  markLearned: (itemId: string) => LearnResult;
  addStar: (amount?: number) => void;
  recordGameCorrect: () => void;
  visitCategory: (category: CategoryId) => void;
  addLearningTime: (seconds: number) => void;
  resetProgress: () => Promise<void>;
  /** The next completed category or new badge the child has not seen celebrated yet. */
  pendingCelebration: Celebration | null;
  dismissCelebration: () => void;
}

interface ProgressState {
  progress: Progress;
  isReady: boolean;
}

const ProgressStateContext = createContext<ProgressState | null>(null);
const ProgressActionsContext = createContext<ProgressActions | null>(null);

const SAVE_DELAY_MS = 400;

export function ProgressProvider({ children }: PropsWithChildren) {
  const [progress, dispatch] = useReducer(progressReducer, EMPTY_PROGRESS);
  const [isReady, setIsReady] = useState(false);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const progressRef = useRef(progress);
  const known = useRef<{ badges: Set<string>; categories: Set<CategoryId> } | null>(null);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    let cancelled = false;
    getProgress().then((stored) => {
      if (cancelled) return;
      dispatch({ type: 'hydrate', progress: stored });
      setIsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Anything earned before this launch is already "seen"; only new achievements are queued.
  useEffect(() => {
    if (!isReady) return;
    if (known.current === null) {
      known.current = {
        badges: new Set(progress.badges),
        categories: new Set(progress.completedCategories),
      };
      return;
    }
    const seen = known.current;
    const fresh: Celebration[] = [
      ...progress.completedCategories
        .filter((id) => !seen.categories.has(id))
        .map((id) => ({ kind: 'category' as const, id })),
      ...progress.badges
        .filter((id) => !seen.badges.has(id))
        .map((id) => ({ kind: 'badge' as const, id })),
    ];
    if (fresh.length === 0) return;
    progress.completedCategories.forEach((id) => seen.categories.add(id));
    progress.badges.forEach((id) => seen.badges.add(id));
    setCelebrations((queue) => [...queue, ...fresh]);
  }, [isReady, progress.badges, progress.completedCategories]);

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => void saveProgress(progress), SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isReady, progress]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active' && isReady) void saveProgress(progressRef.current);
    });
    return () => subscription.remove();
  }, [isReady]);

  const markLearned = useCallback((itemId: string): LearnResult => {
    const isNew = !!getItem(itemId) && !progressRef.current.learnedItems.includes(itemId);
    dispatch({ type: 'markLearned', itemId, today: localDay() });
    return { isNew };
  }, []);

  const resetProgress = useCallback(async () => {
    await clearProgress();
    known.current = { badges: new Set(), categories: new Set() };
    setCelebrations([]);
    dispatch({ type: 'reset' });
  }, []);

  const actions = useMemo<ProgressActions>(
    () => ({
      markLearned,
      addStar: (amount = 1) => dispatch({ type: 'addStars', amount }),
      recordGameCorrect: () => dispatch({ type: 'gameCorrect', today: localDay() }),
      visitCategory: (category) => dispatch({ type: 'visitCategory', category }),
      addLearningTime: (seconds) => dispatch({ type: 'addLearningTime', seconds }),
      resetProgress,
      pendingCelebration: celebrations[0] ?? null,
      dismissCelebration: () => setCelebrations((queue) => queue.slice(1)),
    }),
    [markLearned, resetProgress, celebrations],
  );

  const state = useMemo(() => ({ progress, isReady }), [progress, isReady]);

  return (
    <ProgressStateContext.Provider value={state}>
      <ProgressActionsContext.Provider value={actions}>{children}</ProgressActionsContext.Provider>
    </ProgressStateContext.Provider>
  );
}

/** Actions only — components that never read progress avoid re-rendering on every star. */
export function useProgressActions(): ProgressActions {
  const actions = useContext(ProgressActionsContext);
  if (!actions) throw new Error('useProgressActions must be used inside <ProgressProvider>');
  return actions;
}

export function useProgress(): ProgressState & ProgressActions {
  const state = useContext(ProgressStateContext);
  if (!state) throw new Error('useProgress must be used inside <ProgressProvider>');
  return { ...state, ...useProgressActions() };
}
