'use client'

import React, { useEffect, useState } from 'react'
import { hotjar } from 'react-hotjar'
import { usePathname } from 'next/navigation'

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons'
import { BodyLong, Link } from '@navikt/ds-react'

import { initAmplitude, logOversiktForsideVist } from '@/utils/amplitude'
import reportAccessibility from '@/utils/reportAccessibility'

import Footer from '@/components/layout/Footer'
import NavigationBar from '@/components/NavigationBar'

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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

  return (
    <>
      <div id="modal-container"></div>
      <aside className="wip-banner">
        <div>
          <ExclamationmarkTriangleIcon title="Advarsel" fontSize="3rem" />
          <BodyLong>
            <b>Hei!</b> Denne siden er under kontinuerlig utvikling og vil på sikt erstatte Hjelpemiddeldatabasen.
            Foreløpig er ikke alt innhold og alle funksjoner på plass på denne siden. Dersom du ikke finner det du
            leter, gi oss gjerne beskjed på <Link href="mailto:finnhjelpemiddel@nav.no">finnhjelpemiddel@nav.no</Link>{' '}
            eller bruk {''}
            <Link href="https://www.hjelpemiddeldatabasen.no/"> hjelpemiddeldatabasen.no</Link>
          </BodyLong>
        </div>
      </aside>
      <header>
        <NavigationBar />
      </header>
      <main>{children}</main>
      <Footer />
    </>
  )
}

reportAccessibility(React)

export default LayoutProvider
