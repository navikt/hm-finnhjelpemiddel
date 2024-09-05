import LayoutProvider from '@/app/layoutProvider'
import { Metadata } from 'next'

import '@/styles/globals.scss'

export const metadata: Metadata = {
  title: 'FinnHjelpemiddel',
  description: 'Oversikt over hjelpemidler',
}

async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}

export default RootLayout
