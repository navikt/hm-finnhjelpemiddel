import LayoutProvider from '@/app/layoutProvider'
import { Metadata } from 'next'
import { Source_Sans_3 } from 'next/font/google'

import '@/styles/globals.scss'

const source = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'FinnHjelpemiddel',
  description: 'Oversikt over hjelpemidler',
}

async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={source.className}>
      <body>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}

export default RootLayout
