import type { ViewStyle } from 'react-native';

// `boxShadow` is supported on iOS, Android (New Architecture) and web.
export const shadows = {
  soft: { boxShadow: '0px 4px 12px rgba(46, 42, 71, 0.08)' },
  card: { boxShadow: '0px 8px 20px rgba(46, 42, 71, 0.12)' },
  lifted: { boxShadow: '0px 14px 30px rgba(46, 42, 71, 0.18)' },
} satisfies Record<string, ViewStyle>;
