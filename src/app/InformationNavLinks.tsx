'use client'

import { Heading, HGrid, Link, VStack } from '@navikt/ds-react'
import Image from 'next/image'
import { logKlikk } from '@/utils/amplitude'

export const InformationNavLinks = () => {
  return (
    <VStack gap={{ xs: '6', md: '8' }}>
      <Heading level="2" size="medium">
        Informasjon på nav.no
      </Heading>
      <VStack gap="7">
        <HGrid gap="6" columns={'57px auto'}>
          <Image src="/arrow.svg" width="57" height="57" alt="Illustrasjon" aria-hidden />
          <Link
            className="home-page__link"
            href="https://www.nav.no/om-hjelpemidler"
            onClick={() => {
              logKlikk('forsidelenke-informasjon-om-hjelpemidler')
            }}
          >
            Informasjon om hjelpemidler og tilrettelegging
          </Link>
        </HGrid>
        <HGrid gap="6" columns={'57px auto'}>
          <Image src="/arrow.svg" width="57" height="57" alt="Illustrasjon" aria-hidden />
          <Link
            className="home-page__link"
            href="https://www.nav.no/om-hjelpemidler#hvem"
            onClick={() => {
              logKlikk('forsidelenke-dette-ma-du-vite-for-du-soker-som-privatperson')
            }}
          >
            Dette må du vite før du søker som privatperson
          </Link>
        </HGrid>
        <HGrid gap="6" columns={'57px auto'}>
          <Image src="/arrow.svg" width="57" height="57" alt="Illustrasjon" aria-hidden />
          <Link
            className="home-page__link"
            href="https://www.nav.no/om-hjelpemidler#hvordan"
            onClick={() => {
              logKlikk('forsidelenke-slik-gar-du-frem-nar-du-soker-selv')
            }}
          >
            Slik går du frem når du søker selv
          </Link>
        </HGrid>
        <HGrid gap="6" columns={'57px auto'}>
          <Image src="/arrow.svg" width="57" height="57" alt="Illustrasjon" aria-hidden />
          <Link
            className="home-page__link"
            href="https://www.nav.no/soknader"
            onClick={() => {
              logKlikk('forsidelenke-soknad-og-skjema-for-hjelpemidler')
            }}
          >
            Søknad og skjema for hjelpemidler
          </Link>
        </HGrid>
      </VStack>
    </VStack>
  )
}
