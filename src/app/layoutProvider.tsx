'use client'

import { usePathname } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'
import { hotjar } from 'react-hotjar'

import { initAmplitude, logOversiktForsideVist } from '@/utils/amplitude'
import reportAccessibility from '@/utils/reportAccessibility'

import NavigationBar from '@/app/NavigationBar'
import Footer from '@/components/layout/Footer'
import { useMenuStore, useMobileOverlayStore } from '@/utils/global-state-util'
import { Alert, HStack, Link } from '@navikt/ds-react'
import { initInstrumentation } from "@/faro/faro";
import { useFeatureFlags } from "@/hooks/useFeatureFlag";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const featureFlags = useFeatureFlags()
  const { isMenuOpen } = useMenuStore()
  const { isMobileOverlayOpen } = useMobileOverlayStore()

  const visFeilbanner = featureFlags.isEnabled('finnhjelpemiddel.feilbanner')


  useEffect(() => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur()
  }, [pathname])

  useEffect(() => {
    // if browser initialize amplitude
    if (typeof window !== 'undefined') {
      initAmplitude()
      initInstrumentation()
      logOversiktForsideVist()
      if (process.env.NODE_ENV == 'production') {
        hotjar.initialize({ id: 118350, sv: 6 })
      }
    }
  }, [])

  const pagesWithoutHeaderAndFooter = [/^\/produkt\/[^\/]+\/variants$/];

  if (pagesWithoutHeaderAndFooter.some(regex => regex.test(pathname))) {
    return (
      <div className="standalone-page-wrapper">
        {children}
      </div>
    )
  }

  return (
    <Suspense>
      {visFeilbanner && (
        <HStack padding="4" gap="3" justify="center">
          <Alert variant="error">Vi har dessverre tekniske problemer for tiden og siden kan være ustabil som følge av dette. Vi arbeider med å løse problemet.</Alert>
        </HStack>
      )}
      {isMobileOverlayOpen && <div id="cover-main" />}
      <div id="modal-container"></div>
      <header>
        <Link href={'#hovedinnhold'} variant="subtle" className="skiplink">
          Hopp til hovedinnhold
        </Link>
        <NavigationBar />
      </header>

      <main id="hovedinnhold">
        {isMenuOpen && <div id="cover-main" />}
        {children}
      </main>

      <Footer />
    </Suspense>
  )
}

reportAccessibility(React)

export default LayoutProvider
