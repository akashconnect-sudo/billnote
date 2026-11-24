export const breakpoints = {
  xs: 0,
  sm: 360,
  md: 600,
  lg: 1024,
  xl: 1440,
} as const

export type Breakpoint = keyof typeof breakpoints

export function resolveBreakpoint(widthPx: number): Breakpoint {
  if (widthPx >= breakpoints.xl) return 'xl'
  if (widthPx >= breakpoints.lg) return 'lg'
  if (widthPx >= breakpoints.md) return 'md'
  if (widthPx >= breakpoints.sm) return 'sm'
  return 'xs'
}

export function isPhone(breakpoint: Breakpoint): boolean {
  return breakpoint === 'xs' || breakpoint === 'sm'
}

export function isTablet(breakpoint: Breakpoint): boolean {
  return breakpoint === 'md'
}

export function isDesktop(breakpoint: Breakpoint): boolean {
  return breakpoint === 'lg' || breakpoint === 'xl'
}
