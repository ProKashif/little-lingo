import { useCallback, useMemo } from 'react';
import { FlatList, type ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { BadgeCard, ProgressBar, Screen, ScreenHeader, StarCounter, StatTile } from '@/components';
import { activeStreak, useLanguage, useProgress } from '@/context';
import { BADGES } from '@/data/badges';
import { CATEGORIES } from '@/data/categories';
import { useCategoryProgress } from '@/hooks/useCategoryProgress';
import { colors, radius, spacing, typography } from '@/theme';
import type { Badge } from '@/types';

export default function ProgressScreen() {
  const { language, strings: t } = useLanguage();
  const { progress } = useProgress();
  const categoryProgress = useCategoryProgress();
  const earned = useMemo(() => new Set(progress.badges), [progress.badges]);

  const renderBadge = useCallback<ListRenderItem<Badge>>(
    ({ item }) => (
      <BadgeCard
        emoji={item.emoji}
        name={item.name[language]}
        earned={earned.has(item.id)}
        lockedLabel={t.progress.locked}
      />
    ),
    [earned, language, t],
  );

  const header = (
    <View style={styles.header}>
      <View style={styles.center}>
        <StarCounter stars={progress.stars} accessibilityLabel={t.progress.stars} size="large" />
      </View>
      <View style={styles.tiles}>
        <StatTile
          emoji="📖"
          value={progress.learnedItems.length}
          label={t.progress.words}
          color={colors.pastel.sky}
        />
        <StatTile
          emoji="🔥"
          value={activeStreak(progress)}
          label={t.progress.streak}
          color={colors.pastel.peach}
        />
      </View>
      <Text style={styles.section} accessibilityRole="header">
        🏆 {t.progress.badges}
      </Text>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <Text style={styles.section} accessibilityRole="header">
        📚 {t.progress.topics}
      </Text>
      {CATEGORIES.map((category) => {
        const { learned, total } = categoryProgress[category.id];
        return (
          <View key={category.id} style={[styles.topic, { backgroundColor: category.color }]}>
            <Text style={styles.topicEmoji} accessible={false}>
              {category.emoji}
            </Text>
            <View style={styles.topicBody}>
              <ProgressBar
                value={total ? learned / total : 0}
                color={category.accent}
                accessibilityLabel={`${category.name[language]}: ${learned} / ${total}`}
              />
            </View>
            <Text style={styles.topicCount}>
              {learned}/{total}
            </Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <Screen>
      <ScreenHeader title={`⭐ ${t.progress.title}`} />
      <FlatList
        data={BADGES}
        keyExtractor={(item) => item.id}
        renderItem={renderBadge}
        numColumns={3}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg - 6, paddingBottom: spacing.xl },
  header: { gap: spacing.md, paddingHorizontal: 6, marginBottom: spacing.xs },
  center: { alignItems: 'center', paddingVertical: spacing.sm },
  tiles: { flexDirection: 'row', gap: spacing.md },
  section: { ...typography.heading, marginTop: spacing.sm },
  footer: { gap: spacing.sm, paddingHorizontal: 6, marginTop: spacing.md },
  topic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 64,
    borderRadius: radius.md,
  },
  topicEmoji: { fontSize: 30 },
  topicBody: { flex: 1 },
  topicCount: { ...typography.label, minWidth: 48, textAlign: 'right' },
});
