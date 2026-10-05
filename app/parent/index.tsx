import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  ParentGate,
  PressableScale,
  RoundButton,
  Screen,
  ScreenHeader,
  StatTile,
} from '@/components';
import { activeStreak, useLanguage, useProgress } from '@/context';
import { CATEGORIES, getCategory } from '@/data/categories';
import { VOCABULARY } from '@/data/vocabulary';
import { useParentSession } from '@/hooks/useParentSession';
import { LANGUAGES } from '@/i18n';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { CategoryId } from '@/types';

export default function ParentDashboard() {
  const { language, strings: t } = useLanguage();
  const { progress } = useProgress();
  const { isUnlocked, unlock } = useParentSession();

  const favorites = useMemo(
    () =>
      (Object.entries(progress.categoryVisits) as [CategoryId, number][])
        .filter(([, visits]) => visits > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id, visits]) => ({ category: getCategory(id), visits }))
        .filter((entry) => entry.category !== undefined),
    [progress.categoryVisits],
  );

  const back = (
    <RoundButton emoji="⬅️" accessibilityLabel={t.parent.exit} onPress={router.back} size={64} />
  );

  if (!isUnlocked) {
    return (
      <Screen edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.gateTop}>{back}</View>
        <View style={styles.gate}>
          <ParentGate
            title={t.parent.gateTitle}
            hint={t.parent.gateHint}
            holdLabel={t.parent.hold}
            onUnlock={unlock}
          />
        </View>
      </Screen>
    );
  }

  const info = LANGUAGES[language];
  const minutes = Math.floor(progress.learningTimeSeconds / 60);

  return (
    <Screen backgroundColor={colors.surfaceMuted}>
      <ScreenHeader title={t.parent.dashboardTitle} left={back} />
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeIn} style={styles.grid}>
          <View style={styles.row}>
            <StatTile
              emoji="📖"
              value={`${progress.learnedItems.length}/${VOCABULARY.length}`}
              label={t.parent.wordsLearned}
            />
            <StatTile
              emoji="🏆"
              value={`${progress.completedCategories.length}/${CATEGORIES.length}`}
              label={t.parent.categoriesCompleted}
            />
          </View>
          <View style={styles.row}>
            <StatTile emoji="⭐" value={progress.stars} label={t.parent.starsEarned} />
            <StatTile emoji="⏱️" value={t.parent.minutes(minutes)} label={t.parent.learningTime} />
            <StatTile emoji="🔥" value={activeStreak(progress)} label={t.parent.streak} />
          </View>
        </Animated.View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.parent.favorites}</Text>
          {favorites.length === 0 ? (
            <Text style={styles.muted}>{t.parent.noFavorites}</Text>
          ) : (
            favorites.map(({ category, visits }) =>
              category ? (
                <View key={category.id} style={styles.favorite}>
                  <Text style={styles.favoriteEmoji}>{category.emoji}</Text>
                  <Text style={styles.favoriteName}>{category.name[language]}</Text>
                  <Text style={styles.muted}>×{visits}</Text>
                </View>
              ) : null,
            )
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.parent.currentLanguage}</Text>
          <Text style={styles.language}>
            {info.flag} {info.nativeName}
          </Text>
        </View>

        <PressableScale
          onPress={() => router.push('/parent/settings')}
          accessibilityLabel={t.parent.openSettings}
          style={styles.primary}
        >
          <Text style={styles.primaryText}>⚙️ {t.parent.openSettings}</Text>
        </PressableScale>
        <PressableScale
          onPress={router.back}
          accessibilityLabel={t.parent.exit}
          style={styles.secondary}
        >
          <Text style={styles.secondaryText}>{t.parent.exit}</Text>
        </PressableScale>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gateTop: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  gate: { flex: 1, justifyContent: 'center' },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  grid: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  card: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
    ...shadows.soft,
  },
  cardTitle: { ...typography.label, color: colors.textMuted },
  muted: { ...typography.body, color: colors.textMuted },
  favorite: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  favoriteEmoji: { fontSize: 28 },
  favoriteName: { ...typography.body, flex: 1 },
  language: { ...typography.heading },
  primary: {
    minHeight: 68,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  primaryText: { ...typography.heading, color: colors.textOnAccent },
  secondary: { minHeight: 56, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { ...typography.body, color: colors.textMuted },
});
