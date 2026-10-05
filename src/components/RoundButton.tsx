import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, shadows, touchTarget } from '@/theme';
import { PressableScale } from './PressableScale';

interface Props {
  emoji: string;
  accessibilityLabel: string;
  onPress: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
}

/** A large circular icon button — the app's main control for non-readers. */
function RoundButtonBase({
  emoji,
  accessibilityLabel,
  onPress,
  size = touchTarget.large,
  color = colors.surface,
  disabled = false,
}: Props) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      hitSlop={8}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        disabled && styles.disabled,
      ]}
    >
      <Text style={{ fontSize: size * 0.42 }} accessible={false}>
        {emoji}
      </Text>
    </PressableScale>
  );
}

export const RoundButton = memo(RoundButtonBase);

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center', ...shadows.card },
  disabled: { opacity: 0.35 },
});
