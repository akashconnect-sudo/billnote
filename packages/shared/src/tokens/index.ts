/** BILLNOTE — Paper & Ink ledger design tokens */

export const colors = {
  light: {
    bg: '#FAF7F2',
    surface: '#FFFFFF',
    surface2: '#F3EFE8',
    ink: '#1B1F1D',
    muted: '#6B726E',
    line: '#E7E2D9',
    brand: '#10A56B',
    brandDeep: '#0B6B47',
    brandSoft: '#E3F5EC',
    accent: '#F5A524',
    danger: '#E5484D',
    info: '#3B82F6',
    success: '#10A56B',
  },
  dark: {
    bg: '#0F1412',
    surface: '#161C19',
    surface2: '#1D2521',
    ink: '#EEF3F0',
    muted: '#93A09A',
    line: '#26302B',
    brand: '#10A56B',
    brandDeep: '#0B6B47',
    brandSoft: '#12261D',
    accent: '#F5A524',
    danger: '#E5484D',
    info: '#3B82F6',
    success: '#10A56B',
  },
} as const

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const

export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
} as const

export const typeScale = {
  xs: 12,
  sm: 13,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const

export const typography = {
  fontSans: 'var(--font-sans), Poppins, "Segoe UI", sans-serif',
  fontBrand: 'var(--font-sans), Poppins, "Segoe UI", sans-serif',
  bodyMinPx: 14,
  touchMinPx: 48,
  headingWeight: 600,
  kpiWeight: 700,
  headingTracking: '-0.01em',
} as const

export const shadows = {
  soft: '0 1px 2px rgba(27, 31, 29, 0.04), 0 8px 24px rgba(27, 31, 29, 0.06)',
  lift: '0 4px 8px rgba(27, 31, 29, 0.06), 0 16px 32px rgba(27, 31, 29, 0.08)',
  darkSoft: '0 1px 2px rgba(0, 0, 0, 0.24), 0 8px 24px rgba(0, 0, 0, 0.28)',
  darkLift: '0 4px 8px rgba(0, 0, 0, 0.3), 0 16px 32px rgba(0, 0, 0, 0.36)',
} as const

export const motion = {
  tipDelayMs: 300,
  scanDebounceMs: 800,
  durationFastMs: 120,
  durationBaseMs: 200,
  durationSlowMs: 320,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  staggerMs: 40,
} as const

export type ColorScheme = keyof typeof colors
export type AnimationPreference = 'full' | 'reduced' | 'off'
