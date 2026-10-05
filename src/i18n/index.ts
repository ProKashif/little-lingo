import type { Language } from '@/types';
import { en, type Strings } from './en';
import { fr } from './fr';
import { pt } from './pt';

export type { Strings };

export const strings: Record<Language, Strings> = { en, pt, fr };

export interface LanguageInfo {
  code: Language;
  nativeName: string;
  flag: string;
  /** BCP-47 tag for text-to-speech. pt-PT, never pt-BR. */
  speechLocale: string;
  color: string;
  accent: string;
}

export const LANGUAGES: Record<Language, LanguageInfo> = {
  en: {
    code: 'en',
    nativeName: 'English',
    flag: '🇬🇧',
    speechLocale: 'en-GB',
    color: '#D6ECFF',
    accent: '#3E8EDE',
  },
  pt: {
    code: 'pt',
    nativeName: 'Português',
    flag: '🇵🇹',
    speechLocale: 'pt-PT',
    color: '#D4F5E4',
    accent: '#2E9E6A',
  },
  fr: {
    code: 'fr',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechLocale: 'fr-FR',
    color: '#FFDDE6',
    accent: '#D9506F',
  },
};

export const LANGUAGE_LIST: LanguageInfo[] = Object.values(LANGUAGES);
