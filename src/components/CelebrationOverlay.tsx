import { memo, useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { colors, radius, shadows, typography } from '@/theme';
import { PressableScale } from './PressableScale';
import { StarBurst } from './StarBurst';

interface Props {
  visible: boolean;
  emoji: string;
  title: string;
  body?: string;
  buttonLabel: string;
  onClose: () => void;
}

function CelebrationOverlayBase({ visible, emoji, title, body, buttonLabel, onClose }: Props) {
  const bob = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    bob.set(
      withRepeat(
        withSequence(withTiming(-10, { duration: 600 }), withTiming(0, { duration: 600 })),
        -1,
      ),
    );
  }, [visible, bob]);

  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.card}>
          <StarBurst trigger={visible ? 1 : 0} count={12} distance={170} />
          <Animated.Text style={[styles.emoji, bobStyle]} accessible={false}>
            {emoji}
          </Animated.Text>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {body ? <Text style={styles.body}>{body}</Text> : null}
          <Animated.View entering={FadeIn.delay(500)}>
            <PressableScale
              onPress={onClose}
              accessibilityLabel={buttonLabel}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{buttonLabel} ▶</Text>
            </PressableScale>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export const CelebrationOverlay = memo(CelebrationOverlayBase);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
    ...shadows.lifted,
  },
  emoji: { fontSize: 96, lineHeight: 112 },
  title: { ...typography.title, textAlign: 'center' },
  body: { ...typography.body, textAlign: 'center', color: colors.textMuted },
  button: {
    marginTop: 12,
    minHeight: 72,
    paddingHorizontal: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { ...typography.heading, color: colors.textOnAccent },
});
