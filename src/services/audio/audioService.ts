import {
  type AudioPlayer,
  type AudioSource,
  createAudioPlayer,
  setAudioModeAsync,
} from 'expo-audio';
import * as Speech from 'expo-speech';
import { getItem } from '@/data/vocabulary';
import { LANGUAGES } from '@/i18n';
import type { Language } from '@/types';
import { musicAsset, type EffectId } from './audioAssets';
import { type AudioSourceResolver, bundledAudioResolver } from './audioSourceResolver';

interface AudioConfig {
  voiceEnabled: boolean;
  soundEffectsEnabled: boolean;
  musicEnabled: boolean;
}

/** Upper bound on a single clip, so a lost "finished" event can never stall a sequence. */
const MAX_CLIP_MS = 4000;

let config: AudioConfig = { voiceEnabled: true, soundEffectsEnabled: true, musicEnabled: false };
let resolver: AudioSourceResolver = bundledAudioResolver;
let voicePlayer: AudioPlayer | null = null;
let effectPlayer: AudioPlayer | null = null;
let musicPlayer: AudioPlayer | null = null;
let initialised = false;
/** Bumped on every new request so a stale clip's completion never triggers follow-up audio. */
let generation = 0;

export async function initAudio(): Promise<void> {
  if (initialised) return;
  initialised = true;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
    });
  } catch (error) {
    console.warn('[audio] could not set audio mode', error);
  }
}

export function configureAudio(next: AudioConfig): void {
  config = next;
  if (!next.voiceEnabled) void stopAudio();
  syncMusic();
}

export function setAudioSourceResolver(next: AudioSourceResolver): void {
  resolver = next;
}

function playClip(player: AudioPlayer, source: AudioSource, token: number): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const done = (completed: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      subscription.remove();
      resolve(completed && token === generation);
    };
    const timer = setTimeout(() => done(true), MAX_CLIP_MS);
    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) done(true);
    });
    try {
      player.replace(source);
      player.play();
    } catch (error) {
      console.warn('[audio] playback failed', error);
      done(false);
    }
  });
}

function speak(text: string, language: Language, token: number, pitch = 1.1): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (completed: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(completed && token === generation);
    };
    // Some Android TTS engines never call onDone; don't let a sequence hang on them.
    const timer = setTimeout(() => finish(true), MAX_CLIP_MS);
    Speech.speak(text, {
      language: LANGUAGES[language].speechLocale,
      rate: 0.8,
      pitch,
      onDone: () => finish(true),
      onStopped: () => finish(false),
      onError: () => finish(false),
    });
  });
}

/**
 * Says the word for `itemId` in `language`. Resolves `true` when it finished
 * uninterrupted, so callers can chain a follow-up such as the animal sound.
 */
export async function playPronunciation(itemId: string, language: Language): Promise<boolean> {
  if (!config.voiceEnabled) return true;
  const item = getItem(itemId);
  if (!item) return false;

  const token = await interrupt();
  const source = resolver.pronunciation(itemId, language);
  if (source) {
    voicePlayer ??= createAudioPlayer(null);
    return playClip(voicePlayer, source, token);
  }
  return speak(item.translations[language], language, token);
}

/** Plays the item's noise ("Woof!"). `language` picks the spoken fallback. */
export async function playSound(itemId: string, language: Language): Promise<boolean> {
  const sound = getItem(itemId)?.sound;
  if (!config.soundEffectsEnabled || !sound) return true;

  const token = await interrupt();
  const source = resolver.sound(sound.id);
  if (source) {
    voicePlayer ??= createAudioPlayer(null);
    return playClip(voicePlayer, source, token);
  }
  return speak(sound.text[language], language, token, 1.35);
}

/** Speaks a short sentence such as a game question or "Great!". */
export async function speakPhrase(text: string, language: Language): Promise<boolean> {
  if (!config.voiceEnabled) return true;
  const token = await interrupt();
  return speak(text, language, token);
}

/** Fire-and-forget UI jingle. Runs on its own player so it can overlap speech. */
export function playEffect(effectId: EffectId): void {
  if (!config.soundEffectsEnabled) return;
  const source = resolver.effect(effectId);
  if (!source) return;
  effectPlayer ??= createAudioPlayer(null);
  try {
    effectPlayer.replace(source);
    effectPlayer.play();
  } catch (error) {
    console.warn('[audio] effect failed', error);
  }
}

async function interrupt(): Promise<number> {
  generation += 1;
  const token = generation;
  voicePlayer?.pause();
  try {
    await Speech.stop();
  } catch {
    // Nothing was speaking.
  }
  return token;
}

export async function stopAudio(): Promise<void> {
  await interrupt();
}

function syncMusic(): void {
  if (!musicAsset) return;
  if (config.musicEnabled) {
    if (!musicPlayer) {
      musicPlayer = createAudioPlayer(musicAsset);
      musicPlayer.loop = true;
      musicPlayer.volume = 0.25;
    }
    musicPlayer.play();
  } else {
    musicPlayer?.pause();
  }
}
