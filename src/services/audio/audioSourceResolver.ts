import type { AudioSource } from 'expo-audio';
import type { Language } from '@/types';
import { effectAssets, type EffectId, pronunciationAssets, soundAssets } from './audioAssets';

/**
 * Where audio comes from. The service only talks to this interface, so moving
 * recordings to a CDN is a matter of passing a different resolver to
 * `setAudioSourceResolver` — no screen changes.
 */
export interface AudioSourceResolver {
  pronunciation(itemId: string, language: Language): AudioSource | null;
  sound(soundId: string): AudioSource | null;
  effect(effectId: EffectId): AudioSource | null;
}

export const bundledAudioResolver: AudioSourceResolver = {
  pronunciation: (itemId, language) => pronunciationAssets[language][itemId] ?? null,
  sound: (soundId) => soundAssets[soundId] ?? null,
  effect: (effectId) => effectAssets[effectId] ?? null,
};

/**
 * Remote layout: `${baseUrl}/<language>/<itemId>.mp3`, `${baseUrl}/sounds/<id>.mp3`,
 * `${baseUrl}/effects/<id>.mp3`. Bundled files still win, so an app update can
 * ship a few words offline while the rest stream.
 */
export function createRemoteAudioResolver(baseUrl: string): AudioSourceResolver {
  const url = (path: string): AudioSource => ({ uri: `${baseUrl.replace(/\/$/, '')}/${path}` });
  return {
    pronunciation: (itemId, language) =>
      bundledAudioResolver.pronunciation(itemId, language) ?? url(`${language}/${itemId}.mp3`),
    sound: (soundId) => bundledAudioResolver.sound(soundId) ?? url(`sounds/${soundId}.mp3`),
    effect: (effectId) => bundledAudioResolver.effect(effectId) ?? url(`effects/${effectId}.mp3`),
  };
}
