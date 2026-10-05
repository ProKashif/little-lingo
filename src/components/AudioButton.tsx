import { memo, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, shadows, touchTarget, typography } from '@/theme';
import { PressableScale } from './PressableScale';

interface Props {
  onPress: () => void;
  accessibilityLabel: string;
  /** Shown next to the icon, e.g. "Tap to hear". Omit for an icon-only button. */
  label?: string;
  isPlaying?: boolean;
}

function AudioButtonBase({ onPress, accessibilityLabel, label, isPlaying = false }: Props) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      pulse.set(
        withRepeat(
          withSequence(withTiming(1.18, { duration: 260 }), withTiming(1, { duration: 260 })),
          -1,
        ),
      );
    } else {
      cancelAnimation(pulse);
      pulse.set(withTiming(1, { duration: 150 }));
    }
  }, [isPlaying, pulse]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[styles.button, !label && styles.iconOnly]}
    >
      <Animated.Text style={[styles.icon, iconStyle]} accessible={false}>
        🔊
      </Animated.Text>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </PressableScale>
  );
}

export const AudioButton = memo(AudioButtonBase);

const styles = StyleSheet.create({
  button: {
    minHeight: touchTarget.min,
    minWidth: touchTarget.min,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...shadows.soft,
  },
  iconOnly: { paddingHorizontal: 0, width: touchTarget.large, height: touchTarget.large },
  icon: { fontSize: 32 },
  label: { ...typography.label, color: colors.text },
});
