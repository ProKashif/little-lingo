import { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { LanguageInfo } from '@/i18n';
import { colors, radius, shadows, typography } from '@/theme';
import { PressableScale } from './PressableScale';

interface Props {
  language: LanguageInfo;
  index: number;
  selected: boolean;
  disabled?: boolean;
  onSelect: (language: LanguageInfo) => void;
}

function LanguageCardBase({ language, index, selected, disabled = false, onSelect }: Props) {
  const flagTilt = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    flagTilt.set(
      withRepeat(
        withSequence(withTiming(-6, { duration: 900 }), withTiming(6, { duration: 900 })),
        -1,
        true,
      ),
    );
  }, [flagTilt]);

  useEffect(() => {
    if (selected) pop.set(withSequence(withSpring(1.08, { damping: 5 }), withSpring(1)));
  }, [selected, pop]);

  const flagStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${flagTilt.value}deg` }] }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  return (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 120)
        .springify()
        .damping(14)}
    >
      <Animated.View style={popStyle}>
        <PressableScale
          onPress={() => onSelect(language)}
          disabled={disabled}
          accessibilityLabel={language.nativeName}
          accessibilityState={{ selected, disabled }}
          style={[
            styles.card,
            { backgroundColor: language.color },
            selected && { borderColor: language.accent },
          ]}
        >
          <Animated.Text style={[styles.flag, flagStyle]} accessible={false}>
            {language.flag}
          </Animated.Text>
          <Text style={styles.name}>{language.nativeName}</Text>
          <View style={[styles.check, { opacity: selected ? 1 : 0 }]}>
            <Text style={styles.checkText} accessible={false}>
              ✓
            </Text>
          </View>
        </PressableScale>
      </Animated.View>
    </Animated.View>
  );
}

export const LanguageCard = memo(LanguageCardBase);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 112,
    paddingHorizontal: 24,
    borderRadius: radius.xl,
    borderWidth: 4,
    borderColor: 'transparent',
    gap: 20,
    ...shadows.card,
  },
  flag: { fontSize: 64, lineHeight: 76 },
  name: { ...typography.title, flex: 1, color: colors.text },
  check: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: colors.textOnAccent, fontSize: 26, fontWeight: '900' },
});
