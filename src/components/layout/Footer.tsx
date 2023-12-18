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
          <NextLink href="/om-nettstedet" passHref legacyBehavior>
            <Link>Om nettstedet</Link>
          </NextLink>
        </div>
      </div>
    </div>
  </footer>
)
export default Footer
