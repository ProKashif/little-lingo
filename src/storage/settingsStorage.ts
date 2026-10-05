import type { Settings } from '@/types';
import { isRecord, readJson, STORAGE_KEYS, writeJson } from './jsonStorage';

export const DEFAULT_SETTINGS: Settings = {
  voiceEnabled: true,
  soundEffectsEnabled: true,
  musicEnabled: false,
  hapticsEnabled: true,
};

export async function getSettings(): Promise<Settings> {
  const value = await readJson(STORAGE_KEYS.settings);
  if (!isRecord(value)) return DEFAULT_SETTINGS;

  const flag = (key: keyof Settings) =>
    typeof value[key] === 'boolean' ? (value[key] as boolean) : DEFAULT_SETTINGS[key];

  return {
    voiceEnabled: flag('voiceEnabled'),
    soundEffectsEnabled: flag('soundEffectsEnabled'),
    musicEnabled: flag('musicEnabled'),
    hapticsEnabled: flag('hapticsEnabled'),
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson(STORAGE_KEYS.settings, settings);
}
