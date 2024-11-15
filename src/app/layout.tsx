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
      <head>
        <script
          defer
          src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
          data-host-url="https://umami.nav.no"
          data-website-id="d2c4d342-5355-4dbc-9c0e-6d6498f4f4e1"
        ></script>
      </head>
      <body>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}

export default RootLayout
