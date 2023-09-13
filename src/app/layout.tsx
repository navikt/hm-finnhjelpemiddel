import LayoutProvider from '@/app/layoutProvider'

import { Metadata } from 'next'

import '@/styles/globals.scss'

export const metadata: Metadata = {
  title: 'Oversikt over hjelpemidler',
  description: 'Oversikt over hjelpemidler',
  icons: [{ rel: 'icon', type: 'image/x-icon', url: 'favicon.ico', sizes: 'any' }],
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}

export default RootLayout
