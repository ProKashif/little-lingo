import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  AudioButton,
  ProgressDots,
  ReactionBubble,
  RoundButton,
  Screen,
  StarBurst,
  VocabularyCard,
} from '@/components';
import { useLanguage, useProgressActions } from '@/context';
import { getCategory } from '@/data/categories';
import { getItemsByCategory } from '@/data/vocabulary';
import { useLearningTimer } from '@/hooks/useLearningTimer';
import { playPronunciation, playSound, stopAudio } from '@/services/audio';
import { haptics } from '@/services/haptics';
import { colors, radius, spacing, typography } from '@/theme';

const BUBBLE_MS = 2600;

/**
 * SEE → HEAR → TOUCH → REPEAT. One word at a time; the whole picture is the
 * play button, and the controls are three big round buttons.
 */
export default function LearnCategoryScreen() {
  const params = useLocalSearchParams<{ id: string; index?: string }>();
  const category = getCategory(params.id);
  const items = category ? getItemsByCategory(category.id) : [];
  const startIndex = Math.min(
    Math.max(Number(params.index) || 0, 0),
    Math.max(items.length - 1, 0),
  );

  const { language, strings: t } = useLanguage();
  const { markLearned, visitCategory } = useProgressActions();
  const [index, setIndex] = useState(startIndex);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [burst, setBurst] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLearningTimer();

  useEffect(() => {
    if (category) visitCategory(category.id);
  }, [category, visitCategory]);

  useEffect(
    () => () => {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      void stopAudio();
    },
    [],
  );

  const item = items[index];

  const hear = useCallback(async () => {
    if (!item) return;
    const { isNew } = markLearned(item.id);
    if (isNew) {
      setBurst((count) => count + 1);
      haptics.success();
    }

    setBubbleKey((key) => key + 1);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubbleKey(0), BUBBLE_MS);

    setIsPlaying(true);
    const finished = await playPronunciation(item.id, language);
    if (finished && item.sound) await playSound(item.id, language);
    if (finished) setIsPlaying(false);
  }, [item, language, markLearned]);

  const go = useCallback(
    (delta: number) => {
      void stopAudio();
      setIsPlaying(false);
      setBubbleKey(0);
      setIndex((current) => Math.min(Math.max(current + delta, 0), items.length - 1));
    },
    [items.length],
  );

  if (!category || !item) return <Redirect href="/home" />;

  const word = item.translations[language];
  const isLast = index === items.length - 1;

  return (
    <Screen backgroundColor={category.color} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.topBar}>
        <RoundButton emoji="⬅️" accessibilityLabel={t.learn.back} onPress={router.back} size={64} />
        <View style={styles.topicPill}>
          <Text style={styles.topicText} numberOfLines={1}>
            {category.emoji} {category.name[language]}
          </Text>
        </View>
        <AudioButton onPress={hear} accessibilityLabel={t.learn.replay} isPlaying={isPlaying} />
      </View>

      <View style={styles.stage}>
        <View style={styles.bubbleSlot}>
          {bubbleKey > 0 ? (
            <ReactionBubble key={bubbleKey} word={word} soundText={item.sound?.text[language]} />
          ) : null}
        </View>

        <View>
          <VocabularyCard
            key={item.id}
            item={item}
            word={word}
            backgroundColor={colors.surface}
            accessibilityHint={t.learn.tapToHear}
            onPress={hear}
          />
          <StarBurst trigger={burst} />
        </View>

        <Animated.Text
          key={`${item.id}-${language}`}
          entering={FadeInDown.duration(300)}
          style={styles.word}
          numberOfLines={1}
          adjustsFontSizeToFit
          accessibilityRole="header"
        >
          {word}
        </Animated.Text>

        <Animated.View entering={FadeIn.delay(300)}>
          <Text style={styles.hint} accessible={false}>
            🔊 {t.learn.tapToHear}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.controls}>
        <RoundButton
          emoji="⬅️"
          accessibilityLabel={t.learn.previous}
          onPress={() => go(-1)}
          disabled={index === 0}
        />
        <ProgressDots
          count={items.length}
          index={index}
          color={category.accent}
          accessibilityLabel={`${index + 1} / ${items.length}`}
        />
        {isLast ? (
          <RoundButton
            emoji="✅"
            accessibilityLabel={t.learn.done}
            onPress={router.back}
            color={colors.successSoft}
          />
        ) : (
          <RoundButton emoji="➡️" accessibilityLabel={t.learn.next} onPress={() => go(1)} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  topicPill: {
    flexShrink: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  topicText: { ...typography.label },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  bubbleSlot: { minHeight: 76, justifyContent: 'flex-end' },
  word: { ...typography.word, textAlign: 'center', paddingHorizontal: spacing.lg },
  hint: { ...typography.body, color: colors.textMuted },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
});
