'use client'

import { usePathname } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { initAmplitude, stopAmplitude } from '@/utils/amplitude'
import reportAccessibility from '@/utils/reportAccessibility'

import NavigationBar from '@/app/NavigationBar'
import Footer from '@/components/layout/Footer'
import { useMenuStore, useMobileOverlayStore } from '@/utils/global-state-util'
import { Alert, HStack, Link } from '@navikt/ds-react'
import { initInstrumentation } from '@/faro/faro'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import CookieBanner from '@/app/CookieBanner'
import { initSkyra, stopSkyra } from '@/utils/skyra'
import { SkyraSurvey } from '@/app/SkyraSurvey'
import { initUmami, logUmamiKlikk, logUmamiNavigationEvent, stopUmami } from '@/utils/umami'


function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days = 180): void {
  const timeUntilExpiry = days * 24 * 60 * 60 * 1000
  const expiry = new Date()
  expiry.setTime(expiry.getTime() + timeUntilExpiry)
  value = encodeURIComponent(value)
  document.cookie = `${name}=${value}; expires=${expiry.toUTCString()}; path=/`
}

export const removeOptionalCookies = () => {
  const storedCookies = Object.entries(Cookies.get()).map(([name]) => name)
  const cookiesToRemove = storedCookies.filter((cookie) => cookie.startsWith('AMP_'))

  cookiesToRemove.forEach((cookie) => {
    Cookies.remove(cookie, {
      domain: location.hostname,
      path: '/',
    })
  })
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
      return 'pending'
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
        initAmplitude(window.location.hostname)
        initUmami(window.location.hostname)
        initSkyra()
      }
      if (consent === 'false') {
        stopAmplitude()
        stopUmami()
        removeOptionalCookies()
        stopSkyra()
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
            logUmamiNavigationEvent('CookieBanner', 'button_klikked', 'cookie-consent-accepted')
            console.debug('User accepted optional cookies.')
          }}
          disableOptionalCookies={() => {
            setCookie('finnhjelpemiddel-consent', 'false')
            setConsent('false')
            logUmamiKlikk('cookie-consent-declined')
            console.debug('User declined optional cookies.')
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

      {consent === 'true' && (
        <SkyraSurvey
          buttonText={'Tilbakemelding'}
          skyraSlug={'arbeids-og-velferdsetaten-nav/digihot-finnhjelpemiddeltestsurveyv1'}
        />
      )}
      <Footer setCookieConsent={setConsent} />
    </Suspense>
  )
}

reportAccessibility(React)

export default LayoutProvider
