import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { PressableScale, Screen, ScreenHeader } from '@/components';
import { useLanguage } from '@/context';
import { getCategory } from '@/data/categories';
import { FIND_IT } from '@/data/games';
import { getItemsByCategory } from '@/data/vocabulary';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { CategoryId } from '@/types';

export default function GamesScreen() {
  const { language, strings: t } = useLanguage();

  const play = (category?: CategoryId) =>
    router.push({ pathname: '/games/find-item', params: category ? { category } : {} });

  const preview = getItemsByCategory('animals').slice(0, 3);

  return (
    <Screen>
      <ScreenHeader title={`🎮 ${t.games.title}`} subtitle={t.games.subtitle} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <PressableScale
            onPress={() => play()}
            accessibilityLabel={`${t.games.findItTitle}. ${t.games.findItSubtitle}`}
            style={styles.hero}
          >
            <Text style={styles.heroEmoji} accessible={false}>
              {FIND_IT.emoji}
            </Text>
            <Text style={styles.heroTitle}>{t.games.findItTitle}</Text>
            <View style={styles.previewRow}>
              {preview.map((item) => (
                <View key={item.id} style={styles.previewTile}>
                  <Text style={styles.previewEmoji} accessible={false}>
                    {item.illustration.kind === 'emoji' ? item.illustration.value : '⭐'}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.heroSubtitle}>{t.games.findItSubtitle}</Text>
            <View style={styles.playButton}>
              <Text style={styles.playText} accessible={false}>
                ▶
              </Text>
            </View>
          </PressableScale>
        </Animated.View>

        <View style={styles.topics}>
          {FIND_IT.categories.map((id, index) => {
            const category = getCategory(id);
            if (!category) return null;
            return (
              <Animated.View
                key={id}
                entering={FadeInUp.delay(200 + index * 70)}
                style={styles.topicCell}
              >
                <PressableScale
                  onPress={() => play(id)}
                  accessibilityLabel={`${t.games.findItTitle}: ${category.name[language]}`}
                  style={[styles.topic, { backgroundColor: category.color }]}
                >
                  <Text style={styles.topicEmoji} accessible={false}>
                    {category.emoji}
                  </Text>
                  <Text style={styles.topicName} numberOfLines={1} adjustsFontSizeToFit>
                    {category.name[language]}
                  </Text>
                </PressableScale>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.lg },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.pastel.sky,
    ...shadows.card,
  },
  heroEmoji: { fontSize: 64 },
  heroTitle: { ...typography.title },
  heroSubtitle: { ...typography.body, textAlign: 'center', color: colors.textMuted },
  previewRow: { flexDirection: 'row', gap: spacing.md },
  previewTile: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmoji: { fontSize: 40 },
  playButton: {
    marginTop: spacing.sm,
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  playText: { fontSize: 36, color: colors.textOnAccent, marginLeft: 6 },
  topics: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  topicCell: { width: '50%', padding: 6 },
  topic: {
    minHeight: 110,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: spacing.md,
    ...shadows.soft,
  },
  topicEmoji: { fontSize: 44 },
  topicName: { ...typography.label },
});
