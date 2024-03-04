import React from 'react'

import Image from 'next/image'

import { Link } from '@navikt/ds-react'

const Footer = () => (
  <footer className="nav-bunn">
    <div className="nav-bunn__content">
      <div className="nav-bunn__info">
        <Image src="/nav-logo-white.svg" alt="NAV-logo" width={64} height={20} />
        <div>
          <Link href="/om-nettstedet">Om FinnHjelpemiddel</Link>
          <Link href="/rettigheter-og-ansvar">Rettigheter og ansvar</Link>
          <Link href="/til-leverandorer">Til leverandører</Link>
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
