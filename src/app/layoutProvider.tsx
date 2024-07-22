'use client'

import React, { Suspense, useEffect } from 'react'
import { hotjar } from 'react-hotjar'
import { usePathname } from 'next/navigation'

import { initAmplitude, logOversiktForsideVist } from '@/utils/amplitude'
import reportAccessibility from '@/utils/reportAccessibility'

import Footer from '@/components/layout/Footer'
import NavigationBar from '@/app/NavigationBar'
import { useMenuStore, useMobileOverlayStore } from '@/utils/global-state-util'
import Skiplink from '@/components/skiplinks/Skiplink'

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
        hotjar.initialize({ id: 118350, sv: 6 })
      }
    }
  }, [])

  return (
    <Suspense>
      {isMobileOverlayOpen && <div id="cover-main" />}
      <span id={'top-element'} tabIndex={-1} />
      <div id="modal-container"></div>
      <header>
        <Skiplink />
        <NavigationBar />
      </header>

      <main>
        {isMenuOpen && <div id="cover-main" />}
        {children}
      </main>

      <Footer />
    </Suspense>
  )
}

reportAccessibility(React)

export default LayoutProvider
