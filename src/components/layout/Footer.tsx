import { Bleed, BodyShort, Heading, HStack, Link, VStack } from '@navikt/ds-react'

import Image from 'next/image'
import NextLink from 'next/link'
import styles from './Footer.module.scss'
import { ArrowUpIcon } from '@navikt/aksel-icons'

const Footer = ({ setCookieConsent }: { setCookieConsent: (_: null) => void }) => (
  <footer className="main-wrapper--xlarge" style={{ width: '100%' }}>
    <Bleed marginInline="full" asChild reflectivePadding>
      <VStack gap={'14'} className="nav-bunn nav-bunn__info">
        <HStack as={Link} href="#" gap={'2'}>
          <ArrowUpIcon fontSize={24} /> <BodyShort size="large">Til toppen</BodyShort>
        </HStack>
        <div className={styles.footerLinks}>
          <VStack gap={'4'} className={styles.footerLinkGroup}>
            <Heading level="2" size="small" className={styles.heading}>
              Kontakt
            </Heading>
            <Link href="https://www.nav.no/kontaktoss">Kontakt Nav</Link>
            <Link href="https://www.nav.no/kontaktoss#finn-hjelpemiddelsentral">Finn din hjelpemiddelsentral</Link>
          </VStack>

          <VStack gap={'4'} className={styles.footerLinkGroup}>
            <Heading level="2" size="small" className={styles.heading}>
              Søke om hjelpemiddel
            </Heading>
            <Link href="https://www.nav.no/om-hjelpemidler#hvordan"> Hvordan søke om hjelpemiddel</Link>
            <Link href="https://www.nav.no/soknader">Søknad og skjema for hjelpemidler</Link>
          </VStack>

          <VStack gap={'4'} className={styles.footerLinkGroup}>
            <Heading level="2" size="small" className={styles.heading}>
              Om FinnHjelpemiddel
            </Heading>
            <Link as={NextLink} href="/om-nettstedet">
              Informasjon om nettstedet
            </Link>
            <Link as={NextLink} href="/rettigheter-og-ansvar">
              Rettigheter og ansvar
            </Link>
            <Link as={NextLink} href="/til-leverandorer">
              For leverandører
            </Link>
            <Link
              as={NextLink}
              href="https://uustatus.no/nb/erklaringer/publisert/d760f748-feec-4cdb-b1cb-9535f1219060"
              rel="noopener noreferrer"
              target="_blank"
            >
              Tilgjengelighetserklæring
            </Link>
            <Link as={NextLink} href={'/informasjonskapsler'}>
              Om informasjonskapsler
            </Link>
            <Link onClick={() => setCookieConsent(null)}>Endre samtykke for informasjonskapsler</Link>
          </VStack>
        </div>
        <Image src="/nav-logo-white.svg" alt="NAV-logo" width={64} height={20} />
      </VStack>
    </Bleed>
  </footer>
)
export default Footer
