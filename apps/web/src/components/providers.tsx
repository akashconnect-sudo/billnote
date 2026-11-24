'use client'

import { ThemeProvider, ToastProvider } from '@billnote/ui'
import type { ReactNode } from 'react'
import { ServiceWorkerRegister } from './sw-register'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ServiceWorkerRegister />
        {children}
      </ToastProvider>
    </ThemeProvider>
  )
}
