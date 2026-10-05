import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { configureAudio } from '@/services/audio';
import { configureHaptics } from '@/services/haptics';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from '@/storage';
import type { Settings } from '@/types';

interface SettingsState {
  settings: Settings;
  isReady: boolean;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const SettingsContext = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSettings().then((stored) => {
      if (cancelled) return;
      setSettings(stored);
      setIsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    configureAudio({
      voiceEnabled: settings.voiceEnabled,
      soundEffectsEnabled: settings.soundEffectsEnabled,
      musicEnabled: settings.musicEnabled,
    });
    configureHaptics(settings.hapticsEnabled);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((current) => {
      const next = { ...current, [key]: value };
      void saveSettings(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ settings, isReady, updateSetting }),
    [settings, isReady, updateSetting],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsState {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings must be used inside <SettingsProvider>');
  return value;
}
