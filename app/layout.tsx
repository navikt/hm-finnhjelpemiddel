import './globals.scss'
import React from 'react'
import reportAccessibility from '../utils/reportAccessibility'
import Link from 'next/link'

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <nav>
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
