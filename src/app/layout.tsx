'use client'

import '@/styles/globals.scss'

import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import NextLink from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import Footer from '@/components/layout/Footer'
import { initAmplitude, logOversiktForsideVist } from '@/utils/amplitude'
import reportAccessibility from '@/utils/reportAccessibility'
import { ExclamationmarkTriangleIcon, MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons'
import { BodyLong, Button, Link } from '@navikt/ds-react'

function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur()
  }, [pathname])

  useEffect(() => {
    // if browser initialize amplitude
    if (typeof window !== 'undefined') {
      initAmplitude()
      logOversiktForsideVist()
    }
  }, [])

  const PageNavigation = () => (
    <ul>
      <li>
        <NextLink href="/" className={classNames('page-link', { 'page-link--active': pathname === '/' })}>
          Finn hjelpemidler
        </NextLink>
      </li>
      <li>
        <NextLink href="/sok" className={classNames('page-link', { 'page-link--active': pathname === '/sok' })}>
          Søk
        </NextLink>
      </li>
      <li>
        <NextLink
          href="/sammenlign"
          className={classNames('page-link', { 'page-link--active': pathname === '/sammenlign' })}
        >
          Sammenligner
        </NextLink>
      </li>
    </ul>
  )

  return (
    <html lang="no">
      <head>
        <title>Oversikt over hjelpemidler</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <header>
          <nav className="nav-topp">
            <aside className="wip-banner">
              <div>
                <ExclamationmarkTriangleIcon title="Advarsel" fontSize="3rem" />
                <BodyLong>
                  <b>Hei!</b> Dette er bare en prototype til testing og utvikling.{' '}
                  <Link href="https://www.hjelpemiddeldatabasen.no/">Her er lenken til hjelpemiddeldatabasen.no</Link>{' '}
                  om du har kommet feil.
                </BodyLong>
              </div>
            </aside>
            <div className="nav-topp__content">
              <Image src="/nav-logo-red.svg" width="64" height="20" alt="Til forsiden" />
              <PageNavigation />
              <Button
                className="nav-topp__menu-button"
                icon={menuOpen ? <XMarkIcon title="Lukk menyen" /> : <MenuHamburgerIcon title="Åpne menyen" />}
                variant="tertiary"
                onClick={() => setMenuOpen(!menuOpen)}
              />
            </div>
            <div className={classNames('nav-topp__menu-content', { open: menuOpen })}>
              {menuOpen && <PageNavigation />}
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

reportAccessibility(React)

export default RootLayout