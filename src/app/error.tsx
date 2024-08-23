'use client'

import { logErrorOnUrl } from '@/utils/amplitude'
import { BodyShort, Heading, List } from '@navikt/ds-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const path = usePathname()

  useEffect(() => {
    logErrorOnUrl(path)
  }, [error, path])

  return (
    <div className="main-wrapper--large spacing-vertical--xlarge">
      <Heading level="1" size="large" className="spacing-bottom--medium">
        Beklager, vi fant ikke siden
      </Heading>
      <BodyShort>Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.</BodyShort>
      <List>
        <List.Item>Bruk gjerne søket eller menyen</List.Item>
        <List.Item>
          <Link href="/">Gå til forsiden</Link>
        </List.Item>
      </List>
    </div>
  )
}
