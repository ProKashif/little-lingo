import { memo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { radius, shadows } from '@/theme';
import type { VocabularyItem } from '@/types';
import { Illustration } from './Illustration';
import { PressableScale } from './PressableScale';

interface Props {
  item: VocabularyItem;
  word: string;
  backgroundColor: string;
  accessibilityHint: string;
  onPress: () => void;
}

/** The big tappable picture. Tapping wiggles and bounces it, then hands off to `onPress`. */
function VocabularyCardBase({ item, word, backgroundColor, accessibilityHint, onPress }: Props) {
  const { width, height } = useWindowDimensions();
  const size = Math.min(width - 64, height * 0.38, 360);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }],
  }));

  const handlePress = () => {
    rotate.set(
      withSequence(
        withTiming(-8, { duration: 80 }),
        withTiming(8, { duration: 110 }),
        withTiming(-4, { duration: 90 }),
        withTiming(0, { duration: 80 }),
      ),
    );
    scale.set(withSequence(withSpring(1.1, { damping: 6 }), withSpring(1, { damping: 10 })));
    onPress();
  };

  return (
    <Animated.View key={item.id} entering={ZoomIn.springify().damping(14)}>
      <PressableScale
        onPress={handlePress}
        accessibilityLabel={word}
        accessibilityHint={accessibilityHint}
        scaleTo={0.97}
        style={[styles.card, { width: size, height: size, backgroundColor }]}
      >
        <Animated.View style={animatedStyle}>
          <Illustration illustration={item.illustration} size={size * 0.5} />
        </Animated.View>
      </PressableScale>
    </Animated.View>
  );
}

export const VocabularyCard = memo(VocabularyCardBase);

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lifted,
  },
});
