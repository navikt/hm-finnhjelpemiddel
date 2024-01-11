import LayoutProvider from '@/app/layoutProvider'

import { Metadata } from 'next'

import '@/styles/globals.scss'
import { getToggles } from '@/toggles/rsc'
import Providers from '@/app/_providers'

export const metadata: Metadata = {
  title: 'FinnHjelpemiddel',
  description: 'Oversikt over hjelpemidler',
}

async function RootLayout({ children }: { children: React.ReactNode }) {
  const [toggles] = await Promise.all([getToggles()])

  return (
    <html lang="no">
      <body>
        <Providers toggles={toggles.toggles}>
          <LayoutProvider>{children}</LayoutProvider>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
