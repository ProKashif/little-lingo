import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { strings, type Strings } from '@/i18n';
import { getSelectedLanguage, setSelectedLanguage } from '@/storage';
import type { Language } from '@/types';

interface LanguageState {
  /** `null` until the child has picked one on first launch. */
  selectedLanguage: Language | null;
  /** The language to render with — falls back to English before a choice is made. */
  language: Language;
  strings: Strings;
  isReady: boolean;
  setLanguage: (language: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageState | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [selectedLanguage, setSelected] = useState<Language | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSelectedLanguage().then((stored) => {
      if (cancelled) return;
      setSelected(stored);
      setIsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback(async (language: Language) => {
    setSelected(language);
    await setSelectedLanguage(language);
  }, []);

  const value = useMemo<LanguageState>(() => {
    const language = selectedLanguage ?? 'en';
    return { selectedLanguage, language, strings: strings[language], isReady, setLanguage };
  }, [selectedLanguage, isReady, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageState {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return value;
}

export function useStrings(): Strings {
  return useLanguage().strings;
}
