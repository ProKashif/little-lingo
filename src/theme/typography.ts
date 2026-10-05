import { Platform, type TextStyle } from 'react-native';

const rounded = Platform.select({ ios: 'ui-rounded', default: undefined });

const base: TextStyle = { fontFamily: rounded, color: '#2E2A47' };

export const typography = {
  hero: { ...base, fontSize: 44, lineHeight: 52, fontWeight: '900' },
  word: { ...base, fontSize: 52, lineHeight: 62, fontWeight: '900' },
  title: { ...base, fontSize: 32, lineHeight: 40, fontWeight: '800' },
  heading: { ...base, fontSize: 24, lineHeight: 30, fontWeight: '800' },
  body: { ...base, fontSize: 19, lineHeight: 26, fontWeight: '600' },
  label: { ...base, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  caption: { ...base, fontSize: 14, lineHeight: 18, fontWeight: '600' },
} satisfies Record<string, TextStyle>;

export const emojiSize = {
  small: 32,
  medium: 56,
  large: 88,
  giant: 140,
} as const;
