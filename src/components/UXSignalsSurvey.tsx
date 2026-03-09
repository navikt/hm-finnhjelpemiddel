'use client'

import { useState } from 'react'
import { getCookie } from '@/app/layoutProvider'
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
          <div data-uxsignals-embed="panel-p9bmli1xkl" style={{ maxWidth: '620px' }} />
          <Script src="https://widget.uxsignals.com/embed.js"></Script>
        </>
      )}
    </div>
  )
}
