export const palette = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#E60023',
  gray900: '#111111',
  gray800: '#1A1A1A',
  gray700: '#2B2B2B',
  gray600: '#3A3A3A',
  gray500: '#767676',
  gray300: '#B7B7B7',
  gray100: '#EFEFEF',
} as const;

export const darkTheme = {
  background: palette.black,
  surface: palette.gray900,
  surfaceElevated: palette.gray800,
  border: palette.gray700,
  textPrimary: palette.white,
  textSecondary: palette.gray300,
  textMuted: palette.gray500,
  accent: palette.red,
  tabBarBackground: '#141414',
  chipBackground: palette.gray800,
  chipBackgroundActive: palette.white,
  chipTextActive: palette.black,
} as const;

export type Theme = typeof darkTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '800' as const },
  heading: { fontSize: 20, fontWeight: '700' as const },
  subheading: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
};
