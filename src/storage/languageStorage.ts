import { isLanguage, type Language } from '@/types';
import { readJson, STORAGE_KEYS, writeJson } from './jsonStorage';

export async function getSelectedLanguage(): Promise<Language | null> {
  const value = await readJson(STORAGE_KEYS.language);
  return isLanguage(value) ? value : null;
}

export async function setSelectedLanguage(language: Language): Promise<void> {
  await writeJson(STORAGE_KEYS.language, language);
}
