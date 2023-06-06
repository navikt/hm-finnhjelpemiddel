import React from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import { BodyLong, BodyShort } from '@navikt/ds-react'

const Footer = () => (
  <footer className="nav-bunn">
    <div className="nav-bunn__content">
      <div className="nav-bunn__info">
        <Image src="/nav-logo-black.svg" alt="Test" width={60} height={37} />
        <div>
          <BodyLong>
            <b>Finn hjelpemidler</b>
          </BodyLong>
          <BodyLong>Finn hjelpemidler er en tjeneste fra NAV</BodyLong>
          <NextLink href="/om-nettstedet">Om nettstedet</NextLink>
        </div>
      </div>
    </div>
  </footer>
)
export default Footer
