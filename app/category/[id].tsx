import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, type ListRenderItem, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Illustration, PressableScale, RoundButton, Screen, ScreenHeader } from '@/components';
import { useLanguage, useProgress } from '@/context';
import { getCategory } from '@/data/categories';
import { getItemsByCategory } from '@/data/vocabulary';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { VocabularyItem } from '@/types';

/** All words in a topic, with a tick on the ones already learned. Tapping one starts there. */
export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = useMemo(() => getCategory(id), [id]);
  const items = useMemo(() => (category ? getItemsByCategory(category.id) : []), [category]);
  const { language, strings: t } = useLanguage();
  const { progress } = useProgress();
  const learned = useMemo(() => new Set(progress.learnedItems), [progress.learnedItems]);

  const open = useCallback(
    (index: number) => {
      if (!category) return;
      router.push({ pathname: '/learn/[id]', params: { id: category.id, index: String(index) } });
    },
    [category],
  );

  const renderItem = useCallback<ListRenderItem<VocabularyItem>>(
    ({ item, index }) => (
      <Animated.View entering={FadeIn.delay(Math.min(index, 12) * 30)} style={styles.cell}>
        <PressableScale
          onPress={() => open(index)}
          accessibilityLabel={item.translations[language]}
          accessibilityState={{ checked: learned.has(item.id) }}
          style={[styles.tile, { backgroundColor: category?.color ?? colors.surface }]}
        >
          <Illustration illustration={item.illustration} size={44} />
          <Text style={styles.word} numberOfLines={1} adjustsFontSizeToFit>
            {item.translations[language]}
          </Text>
          {learned.has(item.id) ? (
            <View style={styles.tick}>
              <Text style={styles.tickText} accessible={false}>
                ✓
              </Text>
            </View>
          ) : null}
        </PressableScale>
      </Animated.View>
    ),
    [category, language, learned, open],
  );

  if (!category) return <Redirect href="/learn" />;

  return (
    <Screen>
      <ScreenHeader
        title={`${category.emoji} ${category.name[language]}`}
        subtitle={t.learn.words(items.filter((item) => learned.has(item.id)).length, items.length)}
        left={
          <RoundButton
            emoji="⬅️"
            accessibilityLabel={t.learn.back}
            onPress={router.back}
            size={64}
          />
        }
        right={
          <RoundButton
            emoji="▶️"
            accessibilityLabel={t.learn.title}
            onPress={() => open(0)}
            size={64}
            color={category.color}
          />
        }
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        removeClippedSubviews
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  cell: { flex: 1 / 3, padding: 6 },
  tile: {
    aspectRatio: 0.9,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    gap: 4,
    ...shadows.soft,
  },
  word: { ...typography.label, textAlign: 'center' },
  tick: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickText: { color: colors.textOnAccent, fontWeight: '900', fontSize: 15 },
});
