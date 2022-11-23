'use client'
import React from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import { BodyShort, Link } from '@navikt/ds-react'
import { Up } from '@navikt/ds-icons'
import reportAccessibility from '../utils/reportAccessibility'

import '../styles/globals.scss'

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <head>
        <title>Oversikt over hjelpemidler</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </head>
      <body>
        <nav className="nav-topp">
          <div className="nav-topp__content">
            <ul>
              <li>
                <NextLink href="/">
                  <Image src="/nav-logo-red.svg" width="64" height="20" alt="Til forsiden" />
                  <b>Hjelpemidler</b>
                </NextLink>
              </li>
            </ul>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="nav-bunn">
          <div className="nav-bunn__content">
            <Link href="#">
              <Up title="Til toppen" />
              Til toppen
            </Link>
            <div className="nav-bunn__info">
              <Image src="/nav-logo-black.svg" alt="Test" width={60} height={37} />
              <div>
                <BodyShort>
                  <b>Om Hjelpemiddeloversikten</b>
                </BodyShort>
                <BodyShort>Hjelpemiddeloversikten er en tjeneste fra NAV</BodyShort>
                <Link href="#">Om oss</Link>
                <Link href="#">Kontakt oss</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

reportAccessibility(React)

export default RootLayout
