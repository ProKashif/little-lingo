import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { AppState } from 'react-native';
import { useProgressActions } from '@/context';

/** A single uninterrupted segment longer than this is almost certainly an idle phone. */
const MAX_SEGMENT_SECONDS = 15 * 60;

/** Counts time while the calling screen is focused and the app is in the foreground. */
export function useLearningTimer(): void {
  const { addLearningTime } = useProgressActions();

  useFocusEffect(
    useCallback(() => {
      let startedAt: number | null = Date.now();

      const flush = () => {
        if (startedAt === null) return;
        const seconds = Math.round((Date.now() - startedAt) / 1000);
        startedAt = null;
        if (seconds > 0) addLearningTime(Math.min(seconds, MAX_SEGMENT_SECONDS));
      };

      const subscription = AppState.addEventListener('change', (state) => {
        if (state === 'active') startedAt ??= Date.now();
        else flush();
      });

      return () => {
        subscription.remove();
        flush();
      };
    }, [addLearningTime]),
  );
}
