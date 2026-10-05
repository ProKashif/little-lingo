import type { AudioSource } from 'expo-audio';
import type { Language } from '@/types';

/**
 * Bundled audio registry.
 *
 * No recordings ship with the MVP, so every table below starts EMPTY and the
 * audio service falls back to the device's text-to-speech voice (en-GB, pt-PT,
 * fr-FR). To add a real recording, drop the file in place and register it:
 *
 *   assets/audio/pt/dog.mp3  →  pt: { dog: require('../../../assets/audio/pt/dog.mp3') }
 *
 * Metro bundles a file only when it is `require`d here, so nothing loads at
 * startup until the matching word is played. See README → "Adding audio".
 */
export const pronunciationAssets: Record<Language, Partial<Record<string, AudioSource>>> = {
  en: {},
  pt: {},
  fr: {},
};

/** Animal and vehicle noises, keyed by `VocabularyItem.sound.id` (assets/audio/sounds/). */
export const soundAssets: Partial<Record<string, AudioSource>> = {};

export type EffectId = 'success' | 'tryAgain' | 'tap' | 'celebrate';

/** Short UI jingles (assets/audio/effects/). Missing effects are silently skipped. */
export const effectAssets: Partial<Record<EffectId, AudioSource>> = {};

/** Looping background track (assets/audio/music/). `null` until one is added. */
export const musicAsset: AudioSource | null = null;
