import React from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import reportAccessibility from '../utils/reportAccessibility'
import '../styles/globals.scss'

import Footer from './Footer'

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <head>
        <title>Oversikt over hjelpemidler</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </head>
      <body>
        <div className="WIP">
          <p>
            Under arbeid <span>&#128119;</span>
          </p>
        </div>
        <nav className="nav-topp">
          <div className="nav-topp__content">
            <ul>
              <li>
                <NextLink href="/">
                  <Image src="/nav-logo-red.svg" width="64" height="20" alt="Til forsiden" />
                  <b>Hjelpemiddeloversikten</b>
                </NextLink>
              </li>
              <li className="nav-veileder">
                <NextLink href="/veileder">
                  <p>Veileder</p>
                </NextLink>
              </li>
            </ul>
          </div>
        </nav>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

reportAccessibility(React)

export default RootLayout
