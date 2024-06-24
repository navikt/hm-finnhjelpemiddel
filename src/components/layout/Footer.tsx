import Image from 'next/image'

import { Bleed, BodyLong, Link } from '@navikt/ds-react'

import NextLink from 'next/link'

const Footer = () => (
  <footer className="main-wrapper--xlarge" style={{ width: '100%' }}>
    <Bleed marginInline="full" asChild reflectivePadding>
      <div className="nav-bunn nav-bunn__info">
        <Image src="/nav-logo-white.svg" alt="NAV-logo" width={64} height={20} />
        <div>
          <BodyLong weight="semibold" size="large">
            Finnhjelpemiddel er en NAV tjeneste
          </BodyLong>
          <Link as={NextLink} href="/om-nettstedet">
            Om FinnHjelpemiddel
          </Link>
          <Link as={NextLink} href="/rettigheter-og-ansvar">
            Rettigheter og ansvar
          </Link>
          <Link as={NextLink} href="/til-leverandorer">
            Til leverandører
          </Link>
          <Link
            as={NextLink}
            href="https://uustatus.no/nb/erklaringer/publisert/d760f748-feec-4cdb-b1cb-9535f1219060"
            rel="noopener noreferrer"
            target="_blank"
          >
            Tilgjengelighetserklæring
          </Link>
        </div>
      </div>
    </Bleed>
  </footer>
)
export default Footer
