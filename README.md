# Little Lingo 🌈

A toddler-friendly (ages 1–5) vocabulary app in **English 🇬🇧, European Portuguese 🇵🇹 and French 🇫🇷**.
The core loop is **SEE → HEAR → TOUCH → REPEAT → LEARN**: a big picture, a spoken word, a tap, a star.

Built with Expo SDK 57, React Native 0.86, TypeScript (strict), Expo Router, Reanimated 4,
AsyncStorage, `expo-audio` and `expo-speech`. No backend, no ads, no accounts, no external links,
no runtime permission prompts.

---

## Run it

```bash
npm install
npx expo start
```

### On an Android phone (quickest)

1. Install **Expo Go** from the Play Store.
2. Run `npx expo start` and scan the QR code with Expo Go.

Everything the app uses (Reanimated, audio, speech, haptics, AsyncStorage) ships inside Expo Go,
so you do not need a development build.

### On the Android emulator

Install Android Studio, create an emulator (Device Manager), start it, then press `a` in the
`npx expo start` terminal (or run `npm run android`).

### Installable APK (no Android Studio needed)

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

EAS builds in the cloud and returns a link to an `.apk` you can sideload onto any Android
device. `--profile production` produces a Play Store `.aab` instead. Profiles live in `eas.json`.

### iOS

`npx expo start` then press `i` (simulator) or scan with Expo Go on an iPhone. The same code runs
unchanged.

### Checks

```bash
npm run typecheck   # tsc --noEmit, strict + noUncheckedIndexedAccess
npm run lint        # eslint-config-expo, including React Compiler rules
npx expo-doctor     # dependency / config health
```

---

## Project structure

```text
app/                          Expo Router — every file is a screen
├── _layout.tsx               Providers, root stack, global celebration host
├── index.tsx                 First-launch redirect: saved language? → /home : /language
├── language.tsx              Animated language picker
├── (tabs)/                   Child-facing bottom tabs
│   ├── _layout.tsx           🏠 Home · 📚 Learn · 🎮 Games · ⭐ Stars
│   ├── home.tsx              Category grid + "Play Find It"
│   ├── learn.tsx             Category list with progress
│   ├── games.tsx             Game picker (all topics or one)
│   └── progress.tsx          Stars, streak, badges, per-topic progress
├── category/[id].tsx         All words in a topic (✓ = learned)
├── learn/[id].tsx            One word at a time — tap to hear
├── games/find-item.tsx       "Find It" game
└── parent/
    ├── index.tsx             Hold-to-unlock gate → Parent Dashboard
    └── settings.tsx          Language, sound, music, vibration, reset

src/
├── data/                     The single source of content
│   ├── categories.ts         8 topics (names in every language, colours)
│   ├── vocabulary.ts         84 words × 3 languages (+ gender, animal sounds)
│   ├── games.ts              Game definitions + pure round generator
│   └── badges.ts             Badge rules
├── i18n/                     UI strings — en.ts defines the shape, pt.ts / fr.ts must match
├── context/                  LanguageContext, ProgressContext (+ pure reducer), SettingsContext
├── storage/                  The only code that touches AsyncStorage
├── services/
│   ├── audio/                playPronunciation · playSound · speakPhrase · playEffect · stopAudio
│   └── haptics.ts
├── hooks/                    useLearningTimer, useParentSession, useCategoryProgress
├── components/               LanguageCard, CategoryCard, VocabularyCard, AudioButton, ProgressBar,
│                             StarCounter, BadgeCard, GameOption, ParentGate, …
├── theme/                    colors · typography · spacing · shadows
├── types/                    Language, VocabularyItem, Category, Progress, Settings, Badge
└── utils/

assets/audio/{en,pt,fr,sounds,effects,music}/   Drop recordings here (see below)
```

---

## Audio

**No recorded audio ships with this MVP.** The folders under `assets/audio/` are empty on
purpose. Until recordings are added, the audio service speaks every word with the device's
built-in text-to-speech voice in the right locale (`en-GB`, **`pt-PT`**, `fr-FR`). Animal noises
("Woof!", "Ão ão!", "Ouaf !") and game questions are spoken the same way, and UI jingles are
skipped.

### Adding recordings

1. Add the file using the item `id` from `src/data/vocabulary.ts`:

   ```text
   assets/audio/pt/dog.mp3          pronunciation (one folder per language)
   assets/audio/sounds/dog.mp3      the item's sound (VocabularyItem.sound.id)
   assets/audio/effects/success.mp3 success | tryAgain | tap | celebrate
   assets/audio/music/theme.mp3     background loop
   ```

2. Register it in `src/services/audio/audioAssets.ts`:

   ```ts
   export const pronunciationAssets = {
     en: {},
     pt: { dog: require('../../../assets/audio/pt/dog.mp3') },
     fr: {},
   };
   ```

A registered file always wins over text-to-speech. Files load only when they are played, never at
startup. Keep clips short (under 2 s), mono, 64–96 kbps MP3/AAC.

**Recording tip:** on some Android phones the pt-PT voice is not installed by default and the
engine falls back to another Portuguese voice. Real recordings by a speaker from Portugal are the
best fix. Until then, parents can install the voice under Android Settings → Text-to-speech.

### Streaming from a server later

The service resolves every sound through an `AudioSourceResolver`. To stream:

```ts
import { createRemoteAudioResolver, setAudioSourceResolver } from '@/services/audio';
setAudioSourceResolver(createRemoteAudioResolver('https://cdn.example.com/audio'));
// → https://cdn.example.com/audio/pt/dog.mp3, …/sounds/dog.mp3, …/effects/success.mp3
```

Bundled files still take priority, so a build can keep a few words offline.

---

## Adding a fourth language (e.g. Spanish)

1. `src/types/language.ts`: add `'es'` to `LANGUAGE_CODES`.
2. Run `npm run typecheck`. TypeScript now lists every place that needs a translation:
   - `src/i18n/es.ts`: copy `fr.ts` and translate (`whereIs` must handle `el`/`la`).
   - `src/i18n/index.ts`: register `es` in `strings` and `LANGUAGES` (flag, `es-ES` speech locale, colours).
   - `src/data/categories.ts`, `vocabulary.ts`, `badges.ts`: add an `es` entry per item, and
     `gender.es` on nouns used in games.
3. Optionally add `assets/audio/es/` and an `es: {}` table in `audioAssets.ts`.

No screen changes are needed. Screens only ever read `item.translations[language]`.

---

## European Portuguese

All Portuguese is **pt-PT**, not pt-BR: *autocarro* (not ônibus), *comboio* (not trem),
*bebé* (not bebê), *mamã / papá* (not mamãe / papai), *tu* imperatives (*Toca para ouvir*,
*Encontra*, *Tenta outra vez*), *Definições*, *ecrã*. Speech uses the `pt-PT` voice.

---

## Design notes

- **Non-readers first.** Every control is a large emoji button (≥ 64 dp, most 88 dp). Text labels
  support grown-ups and screen readers but are never required.
- **Gentle game.** Wrong answers shake softly and say "Try again!". Nothing is ever deducted and
  there is no timer.
- **Stars:** +1 the first time a word is heard, +1 per correct answer in Find It.
- **Badges and finished topics** are celebrated by one global host with a queue, so two
  achievements never stack two modals.
- **Parent gate:** hold for 3 seconds. Letting go early resets it. Once unlocked, the parent area
  stays open for 5 minutes.
- **Accessibility:** labels and roles on every control, progress values exposed to
  TalkBack/VoiceOver, locked badges marked with 🔒 (not colour alone), Reanimated respects the
  system "reduce motion" setting, and haptics can be turned off.
- **Low-end Android:** emoji illustrations (no image decoding), `FlatList` everywhere, lazy tabs,
  audio loaded on demand, memoised list items, split progress state/actions contexts, Hermes.

## Privacy and safety

No ads, analytics, accounts, chat, purchases or external links. Progress stays on the device in
AsyncStorage. Android requests only install-time permissions (internet, audio settings, vibrate).
Microphone, storage and overlay permissions are explicitly blocked in `app.json`.
