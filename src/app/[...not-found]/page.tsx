import Link from 'next/link'

import { BodyShort, Heading } from '@/components/aksel-client'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__heading">
          <Heading level="1" size="xlarge">
            Fant ikke siden
          </Heading>
          <BodyShort>Statuskode 404</BodyShort>
        </div>
        <div>
          <BodyShort>
            Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte deg hit.
          </BodyShort>
          <BodyShort>
            {'Bruk gjerne søket, menyen eller '}
            <Link href="/">gå til forsiden</Link>.
          </BodyShort>
        </div>
      </div>
    </div>
  )
}
