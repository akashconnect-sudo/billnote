import { motion as sharedMotion } from '@billnote/shared'

export const motionTokens = {
  duration: {
    fast: sharedMotion.durationFastMs / 1000,
    base: sharedMotion.durationBaseMs / 1000,
    slow: sharedMotion.durationSlowMs / 1000,
  },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  stagger: sharedMotion.staggerMs / 1000,
  tipDelayMs: sharedMotion.tipDelayMs,
}

export const variants = {
  liftCard: {
    rest: { y: 0, boxShadow: 'var(--bn-shadow)' },
    hover: { y: -4, boxShadow: 'var(--bn-shadow-lift)' },
  },
  press: {
    rest: { scale: 1 },
    press: { scale: 0.97 },
  },
  fadeRise: {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  },
  stampIn: {
    hidden: { opacity: 0, scale: 1.4, rotate: -12 },
    show: { opacity: 1, scale: 1, rotate: -6 },
  },
  rowReveal: {
    rest: { x: 0 },
    hover: { x: 0 },
  },
  pageEnter: {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: motionTokens.stagger },
    },
  },
} as const

export type MotionVariantName = keyof typeof variants
