import { memo, useEffect, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { colors, shadows, typography } from '@/theme';

interface Props {
  stars: number;
  accessibilityLabel: string;
  size?: 'small' | 'large';
}

function StarCounterBase({ stars, accessibilityLabel, size = 'small' }: Props) {
  const scale = useSharedValue(1);
  const previous = useRef(stars);

  useEffect(() => {
    if (stars > previous.current) {
      scale.set(withSequence(withSpring(1.3, { damping: 6 }), withSpring(1)));
    }
    previous.current = stars;
  }, [stars, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const large = size === 'large';

  return (
    <Animated.View
      accessible
      accessibilityLabel={`${accessibilityLabel}: ${stars}`}
      style={[styles.pill, large && styles.pillLarge, animatedStyle]}
    >
      <Text style={{ fontSize: large ? 44 : 24 }} accessible={false}>
        ⭐
      </Text>
      <Text style={[styles.count, large && styles.countLarge]}>{stars}</Text>
    </Animated.View>
  );
}

export const StarCounter = memo(StarCounterBase);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.starSoft,
    ...shadows.soft,
  },
  pillLarge: { paddingHorizontal: 28, paddingVertical: 14, gap: 12 },
  count: { ...typography.heading, color: colors.text },
  countLarge: { ...typography.hero },
});
