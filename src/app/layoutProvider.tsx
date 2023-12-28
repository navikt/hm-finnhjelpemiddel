'use client'

import React, { useEffect, useState } from 'react'
import { hotjar } from 'react-hotjar'

import Image from 'next/image'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

import classNames from 'classnames'

import { ExclamationmarkTriangleIcon, MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Button, Link } from '@navikt/ds-react'

import { initAmplitude, logOversiktForsideVist } from '@/utils/amplitude'
import reportAccessibility from '@/utils/reportAccessibility'

import Footer from '@/components/layout/Footer'
import PepperkakeDekorasjon, { SnowfallContext } from '@/components/PepperkakeDekorasjon'
import { useToggle } from '@/toggles/context'

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const env = process.env.NODE_ENV

  const [snowfallEnabled, setSnowfallEnabled] = useState(false)

  useEffect(() => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur()
  }, [pathname])

  useEffect(() => {
    // if browser initialize amplitude
    if (typeof window !== 'undefined') {
      initAmplitude()
      logOversiktForsideVist()
      if (env == 'production') {
        hotjar.initialize(118350, 6)
      }
    }
  }, [env])

  const juledekorasjonToggle = useToggle('juledekorasjon')

  const NavigationBar = ({ menuOpen }: { menuOpen: boolean }) => (
    <ul className="page-links">
      <li className="logo-and-menu-button">
        <NextLink href="/" className="page-link">
          <Image src="/nav-logo.svg" width="40" height="20" alt="Til forsiden" />
          <span className="logo-text">
            <span>FinnHjelpemiddel</span>
          </span>
        </NextLink>
        <Button
          className="nav-topp__burgermenu-button"
          icon={menuOpen ? <XMarkIcon title="Lukk menyen" /> : <MenuHamburgerIcon title="Åpne menyen" />}
          variant="tertiary"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </li>
      {menuOpen && (
        <>
          <li>
            <NextLink href="/sok" className={classNames('page-link', { 'page-link--active': pathname === '/sok' })}>
              <BodyShort size="medium">Søk</BodyShort>
            </NextLink>
          </li>
          <li>
            <NextLink
              href="/sammenlign"
              className={classNames('page-link', { 'page-link--active': pathname === '/sammenlign' })}
            >
              <BodyShort size="medium">Sammenligner</BodyShort>
            </NextLink>
          </li>
          <li>
            <NextLink
              href="/rammeavtale"
              className={classNames('page-link', { 'page-link--active': pathname === '/rammeavtale' })}
            >
              <BodyShort size="medium">Rammeavtaler</BodyShort>
            </NextLink>
          </li>
          {juledekorasjonToggle.enabled && (
            <li>
              <PepperkakeDekorasjon
                onClick={() => {
                  setSnowfallEnabled(!snowfallEnabled)
                }}
              />
            </li>
          )}
        </>
      )}
    </ul>
  )

  return (
    <>
      <SnowfallContext.Provider value={snowfallEnabled}>
        <aside className="wip-banner">
          <div>
            <ExclamationmarkTriangleIcon title="Advarsel" fontSize="3rem" />
            <BodyLong>
              <b>Hei!</b> Denne siden er under kontinuerlig utvikling og vil på sikt erstatte Hjelpemiddeldatabasen.
              Foreløpig er ikke alt innhold og alle funksjoner på plass på denne siden. Dersom du ikke finner det du
              leter etter anbefaler vi å bruke {''}
              <Link href="https://www.hjelpemiddeldatabasen.no/"> hjelpemiddeldatabasen.no</Link>
            </BodyLong>
          </div>
        </aside>
        <header>
          <nav className="nav-topp">
            <div className="nav-topp__content">
              <NavigationBar menuOpen={true} />
            </div>
            <div className={classNames('nav-topp__burgermenu-content', { open: menuOpen })}>
              <NavigationBar menuOpen={menuOpen} />
            </div>
          </nav>
        </header>
        <main>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </main>
        <Footer />
      </SnowfallContext.Provider>
    </>
  )
}

reportAccessibility(React)

export default LayoutProvider
