import { useEffect } from 'react';
import { useLanguage, useProgressActions } from '@/context';
import { getBadge } from '@/data/badges';
import { getCategory } from '@/data/categories';
import { playEffect, speakPhrase } from '@/services/audio';
import { haptics } from '@/services/haptics';
import { CelebrationOverlay } from './CelebrationOverlay';

/**
 * App-wide: celebrates a finished category or a new badge wherever the child is.
 * One host and one queue, so two achievements never stack two modals.
 */
export function CelebrationHost() {
  const { pendingCelebration, dismissCelebration } = useProgressActions();
  const { language, strings } = useLanguage();

  let content: { emoji: string; title: string; body: string } | null = null;
  if (pendingCelebration?.kind === 'category') {
    const category = getCategory(pendingCelebration.id);
    if (category) {
      content = {
        emoji: category.emoji,
        title: strings.learn.categoryDone,
        body: `${category.name[language]} — ${strings.learn.categoryDoneBody}`,
      };
    }
  } else if (pendingCelebration?.kind === 'badge') {
    const badge = getBadge(pendingCelebration.id);
    if (badge) {
      content = {
        emoji: badge.emoji,
        title: badge.name[language],
        body: `🏅 ${strings.progress.badges}`,
      };
    }
  }

  const title = content?.title;
  useEffect(() => {
    if (!title) return;
    playEffect('celebrate');
    haptics.success();
    const timer = setTimeout(() => void speakPhrase(title, language), 700);
    return () => clearTimeout(timer);
  }, [title, language]);

  return (
    <CelebrationOverlay
      visible={content !== null}
      emoji={content?.emoji ?? '🏆'}
      title={content?.title ?? ''}
      body={content?.body}
      buttonLabel={strings.learn.keepGoing}
      onClose={dismissCelebration}
    />
  );
}
