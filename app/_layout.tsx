import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CelebrationHost } from '@/components';
import {
  LanguageProvider,
  ProgressProvider,
  SettingsProvider,
  useLanguage,
  useProgress,
  useSettings,
} from '@/context';
import { initAudio } from '@/services/audio';
import { colors } from '@/theme';

function AppNavigator() {
  const language = useLanguage();
  const progress = useProgress();
  const settings = useSettings();

  useEffect(() => {
    void initAudio();
  }, []);

  if (!language.isReady || !progress.isReady || !settings.isReady) {
    return (
      <View style={styles.loading} accessibilityLabel="Loading">
        <Text style={styles.loadingEmoji}>🌈</Text>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="language" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="learn/[id]" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="games/find-item" options={{ animation: 'fade_from_bottom' }} />
      </Stack>
      <CelebrationHost />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <LanguageProvider>
          <ProgressProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </ProgressProvider>
        </LanguageProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: colors.background,
  },
  loadingEmoji: { fontSize: 72 },
});
