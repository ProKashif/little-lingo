import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme';

interface Props {
  /** 0–1 */
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
  accessibilityLabel?: string;
}

function ProgressBarBase({
  value,
  color = colors.primary,
  trackColor = 'rgba(255,255,255,0.7)',
  height = 12,
  accessibilityLabel,
}: Props) {
  const clamped = Math.min(1, Math.max(0, value));
  const progress = useSharedValue(clamped);

  useEffect(() => {
    progress.set(withTiming(clamped, { duration: 500 }));
  }, [clamped, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor }]}
    >
      <Animated.View
        style={[styles.fill, { borderRadius: height / 2, backgroundColor: color }, fillStyle]}
      />
    </View>
  );
}

export const ProgressBar = memo(ProgressBarBase);

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});
