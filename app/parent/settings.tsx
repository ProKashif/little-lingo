import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  ParentGate,
  PressableScale,
  RoundButton,
  Screen,
  ScreenHeader,
  SettingRow,
} from '@/components';
import { useLanguage, useProgressActions, useSettings } from '@/context';
import { useParentSession } from '@/hooks/useParentSession';
import { LANGUAGE_LIST } from '@/i18n';
import { stopAudio } from '@/services/audio';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export default function ParentSettings() {
  const { language, strings: t, setLanguage } = useLanguage();
  const { settings, updateSetting } = useSettings();
  const { resetProgress } = useProgressActions();
  const { isUnlocked, unlock } = useParentSession();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const back = (
    <RoundButton emoji="⬅️" accessibilityLabel={t.learn.back} onPress={router.back} size={64} />
  );

  if (!isUnlocked) {
    return (
      <Screen edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.gateTop}>{back}</View>
        <View style={styles.gate}>
          <ParentGate
            title={t.parent.gateTitle}
            hint={t.parent.gateHint}
            holdLabel={t.parent.hold}
            onUnlock={unlock}
          />
        </View>
      </Screen>
    );
  }

  const confirmReset = async () => {
    await stopAudio();
    await resetProgress();
    setConfirmingReset(false);
    setResetDone(true);
  };

  return (
    <Screen backgroundColor={colors.surfaceMuted}>
      <ScreenHeader title={t.settings.title} left={back} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section} accessibilityRole="header">
          {t.settings.language}
        </Text>
        <View style={styles.group} accessibilityRole="radiogroup">
          {LANGUAGE_LIST.map((info) => {
            const selected = info.code === language;
            return (
              <PressableScale
                key={info.code}
                onPress={() => void setLanguage(info.code)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={info.nativeName}
                scaleTo={0.97}
                style={[
                  styles.languageRow,
                  selected && { borderColor: info.accent, backgroundColor: info.color },
                ]}
              >
                <Text style={styles.flag}>{info.flag}</Text>
                <Text style={styles.languageName}>{info.nativeName}</Text>
                <Text style={styles.check}>{selected ? '✅' : ''}</Text>
              </PressableScale>
            );
          })}
        </View>

        <Text style={styles.section} accessibilityRole="header">
          {t.settings.sound}
        </Text>
        <View style={styles.group}>
          <SettingRow
            emoji="🗣️"
            label={t.settings.voice}
            value={settings.voiceEnabled}
            onValueChange={(value) => updateSetting('voiceEnabled', value)}
          />
          <SettingRow
            emoji="🔔"
            label={t.settings.soundEffects}
            value={settings.soundEffectsEnabled}
            onValueChange={(value) => updateSetting('soundEffectsEnabled', value)}
          />
          <SettingRow
            emoji="🎵"
            label={t.settings.music}
            value={settings.musicEnabled}
            onValueChange={(value) => updateSetting('musicEnabled', value)}
          />
          <SettingRow
            emoji="📳"
            label={t.settings.haptics}
            value={settings.hapticsEnabled}
            onValueChange={(value) => updateSetting('hapticsEnabled', value)}
          />
        </View>

        <Text style={styles.section} accessibilityRole="header">
          {t.settings.data}
        </Text>
        {confirmingReset ? (
          <Animated.View entering={FadeIn} style={styles.confirm}>
            <Text style={styles.confirmTitle}>{t.settings.resetTitle}</Text>
            <Text style={styles.confirmBody}>{t.settings.resetBody}</Text>
            <View style={styles.confirmButtons}>
              <PressableScale
                onPress={() => setConfirmingReset(false)}
                accessibilityLabel={t.settings.cancel}
                style={[styles.button, styles.cancel]}
              >
                <Text style={styles.buttonText}>{t.settings.cancel}</Text>
              </PressableScale>
              <PressableScale
                onPress={() => void confirmReset()}
                accessibilityLabel={t.settings.confirmReset}
                style={[styles.button, styles.danger]}
              >
                <Text style={[styles.buttonText, styles.dangerText]}>
                  {t.settings.confirmReset}
                </Text>
              </PressableScale>
            </View>
          </Animated.View>
        ) : (
          <PressableScale
            onPress={() => {
              setResetDone(false);
              setConfirmingReset(true);
            }}
            accessibilityLabel={t.settings.resetProgress}
            style={styles.resetRow}
          >
            <Text style={styles.resetText}>🗑️ {t.settings.resetProgress}</Text>
          </PressableScale>
        )}
        {resetDone ? (
          <Animated.Text entering={FadeIn} style={styles.done} accessibilityLiveRegion="polite">
            ✓ {t.settings.resetDone}
          </Animated.Text>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gateTop: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  gate: { flex: 1, justifyContent: 'center' },
  content: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
  section: { ...typography.label, color: colors.textMuted, marginTop: spacing.md },
  group: { gap: spacing.sm },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 72,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  flag: { fontSize: 36 },
  languageName: { ...typography.heading, flex: 1 },
  check: { fontSize: 24, minWidth: 30 },
  resetRow: {
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  resetText: { ...typography.body, color: '#C0392B' },
  confirm: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
    ...shadows.soft,
  },
  confirmTitle: { ...typography.heading },
  confirmBody: { ...typography.body, color: colors.textMuted },
  confirmButtons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  button: {
    flex: 1,
    minHeight: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: { backgroundColor: colors.surfaceMuted },
  danger: { backgroundColor: '#C0392B' },
  buttonText: { ...typography.label },
  dangerText: { color: colors.textOnAccent },
  done: { ...typography.body, color: colors.success, textAlign: 'center', marginTop: spacing.sm },
});
