import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  language: '@little-lingo/language/v1',
  progress: '@little-lingo/progress/v1',
  settings: '@little-lingo/settings/v1',
} as const;

/** Reads JSON, returning `null` on a missing key or a corrupt value instead of crashing the app. */
export async function readJson(key: string): Promise<unknown> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  } catch (error) {
    console.warn(`[storage] could not read ${key}`, error);
    return null;
  }
}

export async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] could not write ${key}`, error);
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] could not remove ${key}`, error);
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
