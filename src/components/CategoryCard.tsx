import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, radius, shadows, typography } from '@/theme';
import type { Category } from '@/types';
import { ProgressBar } from './ProgressBar';
import { PressableScale } from './PressableScale';

interface Props {
  category: Category;
  name: string;
  learned: number;
  total: number;
  index: number;
  onPress: (category: Category) => void;
  accessibilityHint?: string;
}

function CategoryCardBase({
  category,
  name,
  learned,
  total,
  index,
  onPress,
  accessibilityHint,
}: Props) {
  const complete = total > 0 && learned >= total;

  return (
    <Animated.View
      style={styles.cell}
      entering={FadeInUp.delay(Math.min(index, 8) * 60).duration(380)}
    >
      <PressableScale
        onPress={() => onPress(category)}
        accessibilityLabel={`${name}, ${learned} / ${total}`}
        accessibilityHint={accessibilityHint}
        style={[styles.card, { backgroundColor: category.color }]}
      >
        {complete ? (
          <View style={[styles.doneBadge, { backgroundColor: category.accent }]}>
            <Text style={styles.doneText} accessible={false}>
              🏆
            </Text>
          </View>
        ) : null}
        <Text style={styles.emoji} accessible={false}>
          {category.emoji}
        </Text>
        <Text style={styles.name} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
          {name}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.count} accessible={false}>
            ⭐ {learned} / {total}
          </Text>
          <ProgressBar value={total ? learned / total : 0} color={category.accent} height={8} />
        </View>
      </PressableScale>
    </Animated.View>
  );
}

export const CategoryCard = memo(CategoryCardBase);

const styles = StyleSheet.create({
  cell: { flex: 1, padding: 8 },
  card: {
    minHeight: 190,
    borderRadius: radius.lg,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  emoji: { fontSize: 64, lineHeight: 76 },
  name: { ...typography.heading, fontSize: 21, textAlign: 'center', color: colors.text },
  footer: { width: '100%', alignItems: 'center', gap: 6 },
  count: { ...typography.caption, color: colors.text },
  doneBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: { fontSize: 18 },
});
