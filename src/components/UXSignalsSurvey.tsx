'use client'

import { getCookie } from '@/app/layoutProvider'

import { useState } from 'react'

import Script from 'next/script'

export const UXSignalsSurvey = () => {
  const [consent] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return getCookie('finnhjelpemiddel-consent')
    } else {
      return 'pending'
    }
  })

  return (
    <div>
      {consent === 'true' && (
        <>
          <div data-uxsignals-embed="panel-xxgsfjmzr5" style={{ maxWidth: '620px' }} />
          <Script src="https://widget.uxsignals.com/embed.js"></Script>
        </>
      )}
    </div>
  )
}
