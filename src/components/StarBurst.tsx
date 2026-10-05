import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  /** Change this number to fire a burst. 0 = idle. */
  trigger: number;
  count?: number;
  distance?: number;
}

function Particle({
  angle,
  distance,
  trigger,
}: {
  angle: number;
  distance: number;
  trigger: number;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;
    t.set(0);
    t.set(withDelay(30, withTiming(1, { duration: 750, easing: Easing.out(Easing.cubic) })));
  }, [trigger, t]);

  const style = useAnimatedStyle(() => ({
    opacity: t.value === 0 ? 0 : 1 - t.value,
    transform: [
      { translateX: Math.cos(angle) * distance * t.value },
      { translateY: Math.sin(angle) * distance * t.value },
      { scale: 0.6 + t.value * 0.7 },
    ],
  }));

  return (
    <Animated.Text style={[styles.star, style]} accessible={false}>
      ⭐
    </Animated.Text>
  );
}

/** A small ring of stars flying outward — the reward for a new word or a right answer. */
function StarBurstBase({ trigger, count = 8, distance = 130 }: Props) {
  return (
    <View pointerEvents="none" style={styles.layer} accessible={false}>
      {Array.from({ length: count }, (_, index) => (
        <Particle
          key={index}
          angle={(index / count) * Math.PI * 2}
          distance={distance}
          trigger={trigger}
        />
      ))}
    </View>
  );
}

export const StarBurst = memo(StarBurstBase);

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  star: { position: 'absolute', fontSize: 30 },
});
