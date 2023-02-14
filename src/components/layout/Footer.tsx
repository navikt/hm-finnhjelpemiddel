import React from 'react'
import Image from 'next/image'
import { BodyShort, Link } from '@navikt/ds-react'
import { Up } from '@navikt/ds-icons'

const Footer = () => (
  <footer className="nav-bunn">
    <div className="nav-bunn__content">
      <Link href="#">
        <Up title="Til toppen" />
        Til toppen
      </Link>
      <div className="nav-bunn__info">
        <Image src="/nav-logo-black.svg" alt="Test" width={60} height={37} />
        <div>
          <BodyShort>
            <b>Hjelpemiddeloversikten</b>
          </BodyShort>
          <BodyShort>Hjelpemiddeloversikten er en tjeneste fra NAV</BodyShort>
          <Link href="#">Om nettstedet</Link>
          <Link href="#">Kontaktinformasjon</Link>
        </div>
      </div>
    </div>
  </footer>
)
export default Footer
