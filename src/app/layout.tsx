import type { Metadata, Viewport } from 'next'
import { Syne, DM_Mono, Outfit } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title:       'Aether — Atmospheric Intelligence',
  description: 'Premium real-time weather visualization with immersive atmospheric scenes and disaster simulation.',
  keywords:    ['weather', 'forecast', 'atmospheric', 'realtime', 'visualization'],
  authors:     [{ name: 'Aether' }],
  openGraph: {
    title:       'Aether Weather',
    description: 'Premium atmospheric intelligence',
    type:        'website',
  },
}

export const viewport: Viewport = {
  themeColor:      '#060B14',
  width:           'device-width',
  initialScale:    1,
  maximumScale:    5,
  viewportFit:     'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${syne.variable} ${outfit.variable} ${dmMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
