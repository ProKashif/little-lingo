import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LanguageCard, Screen, StarBurst } from '@/components';
import { useLanguage } from '@/context';
import { LANGUAGE_LIST, type LanguageInfo, strings } from '@/i18n';
import { speakPhrase } from '@/services/audio';
import { haptics } from '@/services/haptics';
import { colors, spacing, typography } from '@/theme';

const CELEBRATE_MS = 1100;

export default function LanguageScreen() {
  const { setLanguage } = useLanguage();
  const [selected, setSelected] = useState<LanguageInfo | null>(null);
  const [burst, setBurst] = useState(0);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wave = useSharedValue(0);

  useEffect(() => {
    wave.set(
      withRepeat(
        withSequence(withTiming(14, { duration: 500 }), withTiming(-6, { duration: 500 })),
        -1,
        true,
      ),
    );
    return () => {
      if (navigateTimer.current) clearTimeout(navigateTimer.current);
    };
  }, [wave]);

  const waveStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${wave.value}deg` }] }));

  const handleSelect = useCallback(
    async (language: LanguageInfo) => {
      if (selected) return;
      setSelected(language);
      setBurst((count) => count + 1);
      haptics.success();
      void speakPhrase(strings[language.code].languageScreen.title, language.code);
      await setLanguage(language.code);
      navigateTimer.current = setTimeout(() => router.replace('/home'), CELEBRATE_MS);
    },
    [selected, setLanguage],
  );

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <Animated.Text style={[styles.wave, waveStyle]} accessible={false}>
            👋
          </Animated.Text>
          <Text style={styles.title} accessibilityRole="header">
            {strings.en.languageScreen.title}
          </Text>
          <Text style={styles.subtitle}>{strings.en.languageScreen.subtitle}</Text>
          <Animated.Text entering={FadeInDown.delay(600)} style={styles.otherLanguages}>
            {strings.pt.languageScreen.subtitle} · {strings.fr.languageScreen.subtitle}
          </Animated.Text>
        </Animated.View>

        <View style={styles.cards}>
          {LANGUAGE_LIST.map((language, index) => (
            <LanguageCard
              key={language.code}
              language={language}
              index={index}
              selected={selected?.code === language.code}
              disabled={selected !== null && selected.code !== language.code}
              onSelect={handleSelect}
            />
          ))}
        </View>
      </ScrollView>
      <StarBurst trigger={burst} count={14} distance={220} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.xl,
  },
  header: { alignItems: 'center', gap: spacing.xs },
  wave: { fontSize: 72, lineHeight: 84 },
  title: { ...typography.hero, textAlign: 'center', color: colors.primaryDark },
  subtitle: { ...typography.heading, textAlign: 'center', color: colors.text },
  otherLanguages: { ...typography.label, textAlign: 'center', color: colors.textMuted },
  cards: { gap: spacing.lg },
});
