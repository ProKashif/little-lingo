import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, type ListRenderItem, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CategoryCard, PressableScale, Screen, StarCounter } from '@/components';
import { useLanguage, useProgress } from '@/context';
import { CATEGORIES } from '@/data/categories';
import { useCategoryProgress } from '@/hooks/useCategoryProgress';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { Category } from '@/types';

export default function HomeScreen() {
  const { language, strings: t } = useLanguage();
  const { progress } = useProgress();
  const categoryProgress = useCategoryProgress();

  const openCategory = useCallback((category: Category) => {
    router.push({ pathname: '/learn/[id]', params: { id: category.id } });
  }, []);

  const renderItem = useCallback<ListRenderItem<Category>>(
    ({ item, index }) => (
      <CategoryCard
        category={item}
        name={item.name[language]}
        learned={categoryProgress[item.id].learned}
        total={categoryProgress[item.id].total}
        index={index}
        onPress={openCategory}
      />
    ),
    [language, categoryProgress, openCategory],
  );

  const header = (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <StarCounter stars={progress.stars} accessibilityLabel={t.progress.stars} />
        {/* Deliberately small and plain: it leads to the hold-to-unlock gate, not to settings. */}
        <PressableScale
          onPress={() => router.push('/parent')}
          accessibilityLabel={t.home.grownUps}
          hapticOnPress={false}
          style={styles.parentButton}
        >
          <Text style={styles.parentText}>🔒 {t.home.grownUps}</Text>
        </PressableScale>
      </View>

      <Animated.View entering={FadeInDown.duration(400)}>
        <Text style={styles.greeting} accessibilityRole="header">
          {t.home.greeting} 👋
        </Text>
        <Text style={styles.subtitle}>{t.home.subtitle}</Text>
      </Animated.View>

      <PressableScale
        onPress={() => router.push('/games/find-item')}
        accessibilityLabel={t.home.playGame}
        style={styles.gameCard}
      >
        <Text style={styles.gameEmoji} accessible={false}>
          🔍
        </Text>
        <Text style={styles.gameText}>{t.home.playGame}</Text>
        <Text style={styles.gamePlay} accessible={false}>
          ▶
        </Text>
      </PressableScale>
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        removeClippedSubviews
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 12, paddingBottom: spacing.xl },
  header: {
    paddingHorizontal: 8,
    paddingTop: spacing.sm,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  parentButton: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  parentText: { ...typography.caption, color: colors.textMuted },
  greeting: { ...typography.hero, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 88,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    ...shadows.card,
  },
  gameEmoji: { fontSize: 44 },
  gameText: { ...typography.heading, flex: 1, color: colors.textOnAccent },
  gamePlay: { fontSize: 28, color: colors.textOnAccent },
});
