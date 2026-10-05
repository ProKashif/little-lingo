import { memo, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '@/services/haptics';
import { colors, radius, shadows, typography } from '@/theme';

interface Props {
  title: string;
  hint: string;
  holdLabel: string;
  onUnlock: () => void;
  holdMs?: number;
}

/**
 * Hold-to-unlock gate. A toddler's tap or brief press resets it; only a steady
 * three-second hold opens the parent area.
 */
function ParentGateBase({ title, hint, holdLabel, onUnlock, holdMs = 3000 }: Props) {
  const progress = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const start = () => {
    haptics.select();
    progress.set(withTiming(1, { duration: holdMs, easing: Easing.linear }));
    timer.current = setTimeout(() => {
      timer.current = null;
      haptics.success();
      onUnlock();
    }, holdMs);
  };

  const cancel = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    cancelAnimation(progress);
    progress.set(withTiming(0, { duration: 250 }));
  };

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View style={styles.container}>
      <Text style={styles.lock} accessible={false}>
        🔒
      </Text>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.hint}>{hint}</Text>
      <Pressable
        onPressIn={start}
        onPressOut={cancel}
        accessibilityRole="button"
        accessibilityLabel={`${holdLabel}. ${hint}`}
        style={styles.button}
      >
        <Animated.View style={[styles.fill, fillStyle]} />
        <Text style={styles.buttonText}>{holdLabel}</Text>
      </Pressable>
    </View>
  );
}

export const ParentGate = memo(ParentGateBase);

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 16, paddingHorizontal: 24 },
  lock: { fontSize: 64 },
  title: { ...typography.title, textAlign: 'center' },
  hint: { ...typography.body, textAlign: 'center', color: colors.textMuted },
  button: {
    marginTop: 16,
    width: 260,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.gentle },
  buttonText: { ...typography.heading, color: colors.text },
});
