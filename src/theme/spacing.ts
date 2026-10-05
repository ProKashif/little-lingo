export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  pill: 999,
} as const;

/** Toddlers are imprecise: nothing tappable is smaller than this. */
export const touchTarget = {
  min: 64,
  large: 88,
} as const;
