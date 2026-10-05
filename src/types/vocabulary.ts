import type { Gender, Language, Translations } from './language';

export type CategoryId =
  'animals' | 'food' | 'colors' | 'numbers' | 'alphabet' | 'family' | 'vehicles' | 'objects';

/**
 * How a word is drawn. Emoji keeps the MVP light (no image downloads, crisp at
 * any size); swap a variant for `{ kind: 'image', source }` when real artwork lands.
 */
export type Illustration =
  | { kind: 'emoji'; value: string }
  | { kind: 'color'; hex: string; border?: boolean }
  | { kind: 'number'; value: number; emoji: string }
  | { kind: 'letter'; value: string };

/** A short "what does it say?" reaction, e.g. a dog's "Woof!". */
export interface ItemSound {
  /** Key into the sound-effect registry (assets/audio/sounds/<id>.mp3). */
  id: string;
  text: Translations;
}

export interface VocabularyItem {
  id: string;
  category: CategoryId;
  illustration: Illustration;
  translations: Translations;
  /** Gender per language, needed by games that build a question around the word. */
  gender?: Partial<Record<Language, Gender>>;
  sound?: ItemSound;
}

export interface Category {
  id: CategoryId;
  emoji: string;
  name: Translations;
  /** Card background (pastel) and accent (stronger tone for progress and borders). */
  color: string;
  accent: string;
}
