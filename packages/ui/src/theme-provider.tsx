'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AnimationPreference } from '@billnote/shared'

type Theme = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  animation: AnimationPreference
  setAnimation: (value: AnimationPreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_KEY = 'bn_theme'
const ANIM_KEY = 'bn_animation'

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'light' || theme === 'dark') return theme
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [animation, setAnimationState] = useState<AnimationPreference>('full')
  const [resolved, setResolved] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const storedTheme = (window.localStorage.getItem(THEME_KEY) as Theme | null) ?? 'light'
    const storedAnim =
      (window.localStorage.getItem(ANIM_KEY) as AnimationPreference | null) ?? 'full'
    setThemeState(storedTheme)
    setAnimationState(storedAnim)
    setResolved(resolveTheme(storedTheme))
  }, [])

  useEffect(() => {
    const next = resolveTheme(theme)
    setResolved(next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.setAttribute('data-animation', animation)
    if (animation === 'off' || animation === 'reduced') {
      document.documentElement.style.setProperty('--bn-dur-fast', '0ms')
      document.documentElement.style.setProperty('--bn-dur', animation === 'off' ? '0ms' : '80ms')
      document.documentElement.style.setProperty('--bn-dur-slow', animation === 'off' ? '0ms' : '120ms')
    } else {
      document.documentElement.style.removeProperty('--bn-dur-fast')
      document.documentElement.style.removeProperty('--bn-dur')
      document.documentElement.style.removeProperty('--bn-dur-slow')
    }
  }, [theme, animation])

  const setTheme = useCallback((value: Theme) => {
    setThemeState(value)
    window.localStorage.setItem(THEME_KEY, value)
  }, [])

  const setAnimation = useCallback((value: AnimationPreference) => {
    setAnimationState(value)
    window.localStorage.setItem(ANIM_KEY, value)
  }, [])

  const value = useMemo(
    () => ({ theme, resolved, setTheme, animation, setAnimation }),
    [theme, resolved, setTheme, animation, setAnimation],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
