'use client'

import { usePathname } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import { hotjar } from 'react-hotjar'

import { initAmplitude, stopAmplitude } from '@/utils/amplitude'
import reportAccessibility from '@/utils/reportAccessibility'

import NavigationBar from '@/app/NavigationBar'
import Footer from '@/components/layout/Footer'
import { useMenuStore, useMobileOverlayStore } from '@/utils/global-state-util'
import { Alert, HStack, Link } from '@navikt/ds-react'
import { initInstrumentation } from '@/faro/faro'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import CookieBanner from '@/app/CookieBanner'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days = 90): void {
  const timeUntilExpiry = days * 24 * 60 * 60 * 1000
  const expiry = new Date()
  expiry.setTime(expiry.getTime() + timeUntilExpiry)
  value = encodeURIComponent(value)
  document.cookie = `${name}=${value}; expires=${expiry.toUTCString()}; path=/`
}

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const featureFlags = useFeatureFlags()
  const { isMenuOpen } = useMenuStore()
  const { isMobileOverlayOpen } = useMobileOverlayStore()
  const [consent, setConsent] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return getCookie('finnhjelpemiddel-consent')
    } else {
      return 'server'
    }
  })

  const visFeilbanner = featureFlags.isEnabled('finnhjelpemiddel.feilbanner')

  useEffect(() => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur()
  }, [pathname])

  useEffect(() => {
    // if browser initialize amplitude
    if (typeof window !== 'undefined') {
      if (consent === 'true') {
        initAmplitude()
      }
      if (consent === 'false') {
        stopAmplitude()
      }
      if (process.env.NODE_ENV == 'production') {
        hotjar.initialize({ id: 118350, sv: 6 })
      }
      initInstrumentation()
    }
  }, [consent])

  const pagesWithoutHeaderAndFooter = [/^\/produkt\/[^\/]+\/variants$/]

  if (pagesWithoutHeaderAndFooter.some((regex) => regex.test(pathname))) {
    return <div className="standalone-page-wrapper">{children}</div>
  }

  const showCookieBanner = consent == null

  return (
    <Suspense>
      {showCookieBanner && (
        <CookieBanner
          enableOptionalCookies={() => {
            setCookie('finnhjelpemiddel-consent', 'true')
            setConsent('true')
          }}
          disableOptionalCookies={() => {
            setCookie('finnhjelpemiddel-consent', 'false')
            setConsent('false')
          }}
        />
      )}
      {visFeilbanner && (
        <HStack padding="4" gap="3" justify="center">
          <Alert variant="error">
            Vi har dessverre tekniske problemer for tiden og siden kan være ustabil som følge av dette. Vi arbeider med
            å løse problemet.
          </Alert>
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

      <Footer setCookieConsent={setConsent} />
    </Suspense>
  )
}

reportAccessibility(React)

export default LayoutProvider
