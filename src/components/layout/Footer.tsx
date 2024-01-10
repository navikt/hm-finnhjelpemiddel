import React from 'react'

import Image from 'next/image'
import NextLink from 'next/link'

import { BodyShort, Link } from '@navikt/ds-react'

const Footer = () => (
  <footer className="nav-bunn">
    <div className="nav-bunn__content">
      <div className="nav-bunn__info">
        <Image src="/nav-logo-white.svg" alt="NAV-logo" width={64} height={20} />
        <div>
          <BodyShort>
            <b>FinnHjelpemiddel</b>
          </BodyShort>
          <BodyShort>FinnHjelpemiddel er en tjeneste fra NAV</BodyShort>
          <NextLink href="/om-nettstedet">Om nettstedet</NextLink>
          <Link
            href="https://uustatus.no/nb/erklaringer/publisert/d760f748-feec-4cdb-b1cb-9535f1219060"
            rel="noopener noreferrer"
            target="_blank"
          >
            Tilgjengelighetserklæring
          </Link>
        </div>
      </div>
    </div>
  </footer>
)
export default Footer
