import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Poppins } from 'next/font/google'
import { Providers } from '../components/providers'
import '@billnote/ui/styles.css'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'BILLNOTE',
  description: 'Billing software for Indian shops, on every device.',
  applicationName: 'BILLNOTE',
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable} data-theme="light">
      <body className={`bn-ui-root ${poppins.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
