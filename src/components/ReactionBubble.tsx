import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import { colors, radius, shadows, typography } from '@/theme';

interface Props {
  word: string;
  soundText?: string;
}

/** The speech bubble that pops up after a tap: "🔊 Dog" and, for animals, "Woof!". */
function ReactionBubbleBase({ word, soundText }: Props) {
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(12)}
      exiting={FadeOut.duration(200)}
      style={styles.bubble}
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.word}>🔊 {word}</Text>
      {soundText ? <Text style={styles.sound}>“{soundText}”</Text> : null}
    </Animated.View>
  );
}

export const ReactionBubble = memo(ReactionBubbleBase);

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  word: { ...typography.heading, color: colors.text },
  sound: { ...typography.body, color: colors.primaryDark, fontStyle: 'italic' },
});
