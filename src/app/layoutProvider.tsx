'use client'

import React, { useEffect } from 'react'
import { hotjar } from 'react-hotjar'
import { usePathname } from 'next/navigation'

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons'
import { BodyLong, Link } from '@navikt/ds-react'

import { initAmplitude, logOversiktForsideVist } from '@/utils/amplitude'
import reportAccessibility from '@/utils/reportAccessibility'

import Footer from '@/components/layout/Footer'
import NavigationBar from '@/app/NavigationBar'
import { useMenuStore, useMobileOverlayStore } from '@/utils/global-state-util'

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const { isMenuOpen } = useMenuStore()
  const { isMobileOverlayOpen } = useMobileOverlayStore()

  useEffect(() => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur()
  }, [pathname])

  useEffect(() => {
    // if browser initialize amplitude
    if (typeof window !== 'undefined') {
      initAmplitude()
      logOversiktForsideVist()
      if (process.env.NODE_ENV == 'production') {
        hotjar.initialize(118350, 6)
      }
    }
  }, [])

  return (
    <>
      {isMobileOverlayOpen && <div id="cover-main" />}
      <div id="modal-container"></div>
      <aside className="wip-banner hide-print">
        <div>
          <ExclamationmarkTriangleIcon title="Advarsel" fontSize="3rem" />
          <BodyLong>
            <b>Hei! </b>
            FinnHjelpemiddel vil snart erstatte Hjelpemiddeldatabasen. Foreløpig er ikke alt innhold og alle funksjoner
            på plass her. Dersom du ikke finner det du leter etter, gi oss gjerne beskjed på{' '}
            <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link> eller bruk{' '}
            <Link href="https://www.hjelpemiddeldatabasen.no/"> hjelpemiddeldatabasen.no</Link>
          </BodyLong>
        </div>
      </aside>
      <header>
        <NavigationBar />
      </header>

      <main>
        {isMenuOpen && <div id="cover-main" />}
        {children}
      </main>

      <Footer />
    </>
  )
}

reportAccessibility(React)

export default LayoutProvider
