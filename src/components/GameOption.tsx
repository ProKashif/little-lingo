import { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { colors, radius, shadows } from '@/theme';
import type { VocabularyItem } from '@/types';
import { Illustration } from './Illustration';
import { PressableScale } from './PressableScale';

export type GameOptionState = 'idle' | 'correct' | 'wrong' | 'faded';

interface Props {
  item: VocabularyItem;
  label: string;
  state: GameOptionState;
  /** Bumped on every wrong tap so repeated mistakes shake again. */
  shakeKey: number;
  size: number;
  index: number;
  disabled: boolean;
  onPress: (item: VocabularyItem) => void;
}

function GameOptionBase({ item, label, state, shakeKey, size, index, disabled, onPress }: Props) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (shakeKey === 0) return;
    translateX.set(
      withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12, { duration: 80 }),
        withTiming(-8, { duration: 70 }),
        withTiming(8, { duration: 70 }),
        withTiming(0, { duration: 60 }),
      ),
    );
  }, [shakeKey, translateX]);

  useEffect(() => {
    if (state === 'correct') {
      scale.set(withSequence(withSpring(1.18, { damping: 5 }), withSpring(1.06)));
    } else {
      scale.set(withTiming(1, { duration: 150 }));
    }
  }, [state, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={ZoomIn.delay(index * 90)
        .springify()
        .damping(13)}
    >
      <Animated.View style={animatedStyle}>
        <PressableScale
          onPress={() => onPress(item)}
          disabled={disabled}
          accessibilityLabel={label}
          hapticOnPress={false}
          style={[
            styles.card,
            { width: size, height: size },
            state === 'correct' && styles.correct,
            state === 'faded' && styles.faded,
          ]}
        >
          <Illustration illustration={item.illustration} size={size * 0.5} />
          {state === 'correct' ? (
            <Animated.View entering={ZoomIn.springify()} style={styles.mark}>
              <Text style={styles.markText} accessible={false}>
                ⭐
              </Text>
            </Animated.View>
          ) : null}
          {state === 'wrong' ? (
            <Animated.View entering={FadeIn} style={[styles.mark, styles.markGentle]}>
              <Text style={styles.markText} accessible={false}>
                🤔
              </Text>
            </Animated.View>
          ) : null}
        </PressableScale>
      </Animated.View>
      <View style={styles.spacer} />
    </Animated.View>
  );
}

export const GameOption = memo(GameOptionBase);

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
    ...shadows.card,
  },
  correct: { borderColor: colors.success, backgroundColor: colors.successSoft },
  faded: { opacity: 0.4 },
  mark: {
    position: 'absolute',
    top: -14,
    right: -14,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.starSoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  markGentle: { backgroundColor: colors.pastel.lilac },
  markText: { fontSize: 26 },
  spacer: { height: 4 },
});
