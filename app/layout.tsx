import React from 'react'
import Link from 'next/link'
import reportAccessibility from '../utils/reportAccessibility'
import '../styles/globals.scss'

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <head>
        <title>Oversikt over hjelpemiddelartikler</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </head>
      <body>
        <nav className="nav-topp">
          <ul>
            <li>
              <Link href="/sok">Søk</Link>
            </li>
          </ul>
        </nav>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  )
}

reportAccessibility(React)

export default RootLayout
