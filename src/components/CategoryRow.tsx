import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { colors, radius, shadows, typography } from '@/theme';
import type { Category } from '@/types';
import { ProgressBar } from './ProgressBar';
import { PressableScale } from './PressableScale';

interface Props {
  category: Category;
  name: string;
  caption: string;
  learned: number;
  total: number;
  index: number;
  onPress: (category: Category) => void;
}

function CategoryRowBase({ category, name, caption, learned, total, index, onPress }: Props) {
  return (
    <Animated.View entering={FadeInRight.delay(Math.min(index, 8) * 50).duration(350)}>
      <PressableScale
        onPress={() => onPress(category)}
        accessibilityLabel={`${name}, ${caption}`}
        scaleTo={0.97}
        style={[styles.row, { backgroundColor: category.color }]}
      >
        <View style={styles.iconWrap}>
          <Text style={styles.emoji} accessible={false}>
            {category.emoji}
          </Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
            {name}
          </Text>
          <ProgressBar value={total ? learned / total : 0} color={category.accent} height={10} />
          <Text style={styles.caption}>{caption}</Text>
        </View>
        <Text style={styles.chevron} accessible={false}>
          {learned >= total && total > 0 ? '🏆' : '▶'}
        </Text>
      </PressableScale>
    </Animated.View>
  );
}

export const CategoryRow = memo(CategoryRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    minHeight: 104,
    borderRadius: radius.lg,
    marginBottom: 14,
    ...shadows.soft,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 40 },
  body: { flex: 1, gap: 6 },
  name: { ...typography.heading, color: colors.text },
  caption: { ...typography.caption, color: colors.textMuted },
  chevron: { fontSize: 24, color: colors.textMuted },
});
