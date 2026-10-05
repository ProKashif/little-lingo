/**
 * Every supported language. To add a fourth language, extend this union —
 * TypeScript will then point at every translation table that needs a new entry.
 */
export const LANGUAGE_CODES = ['en', 'pt', 'fr'] as const;

export type Language = (typeof LANGUAGE_CODES)[number];

/** A value that must exist for every supported language. */
export type Translations = Record<Language, string>;

/** Grammatical gender, used to build natural sentences such as "Onde está o gato?". */
export type Gender = 'm' | 'f';

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGE_CODES as readonly string[]).includes(value);
}
