import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Bricolage_Grotesque, Poppins } from 'next/font/google'
import { Providers } from '../components/providers'
import '@billnote/ui/styles.css'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'BILLNOTE — Billing for Indian shops',
  description: 'GST billing, stock, CRM, and daybook for counters, tablets, and desktops.',
  applicationName: 'BILLNOTE',
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${display.variable}`} data-theme="light">
      <body className={`bn-ui-root ${poppins.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
