'use client'

import Image from 'next/image'

import { Bleed, BodyLong, Heading, HGrid, Hide, HStack, Link, Show, VStack } from '@navikt/ds-react'

import AnimateLayout from '@/components/layout/AnimateLayout'
import NewsList from '@/components/NewsList'
import { Buildings2Icon, Chat2Icon, LocationPinIcon } from '@navikt/aksel-icons'
import AgreementList from './rammeavtale/AgreementList'

function Home() {
  return (
    <AnimateLayout>
      <div className="main-wrapper home-page">
        <VStack className="main-wrapper--xlarge" gap={{ xs: '12', lg: '20' }}>
          <HStack gap={{ xs: '10', lg: '20' }}>
            <Hide below="lg">
              <Image src="/holding-hands-logo.svg" width="180" height="180" alt="Illustrasjon" aria-hidden />
            </Hide>

            <Heading level="1" size="large" className="home-page__heading">
              Finn hjelpemiddel i Norges største samling av hjelpemidler på nett.
            </Heading>
          </HStack>

          <HGrid gap={{ xs: '10', md: '18' }} columns={{ xs: '1fr', md: '2fr 1fr' }}>
            <Show below="md">
              <InformationNavLinks />
            </Show>
            <AgreementList />
            <VStack gap="18">
              <Hide below="md">
                <InformationNavLinks />
              </Hide>
              <NewsList />
            </VStack>
          </HGrid>

          <Bleed marginInline="full" asChild reflectivePadding>
            <div className="home-page__kontakt-oss">
              <Heading level="2" size="large" spacing>
                Kontakt oss
              </Heading>
              <HGrid gap="8" columns={{ xs: 1, md: 3 }} className="home-page__kontakt-oss-container">
                <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
                  <div className="home-page__kontakt-oss-icon">
                    <LocationPinIcon aria-hidden fontSize={'32px'} />
                  </div>
                  <div className="spacing-top--small">
                    <Heading level="4" size="medium" className="spacing-bottom--medium">
                      <Link href="https://www.nav.no/kontaktoss#finn-hjelpemiddelsentral" className="home-page__link">
                        Finn din hjelpemiddelsentral
                      </Link>
                    </Heading>
                    <BodyLong>Finn kontaktinformasjon og les om inn- og utlevering av hjelpemidler.</BodyLong>
                  </div>
                </HGrid>
                <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
                  <div className="home-page__kontakt-oss-icon">
                    <Buildings2Icon aria-hidden fontSize={'32px'} />
                  </div>
                  <div className="spacing-top--small">
                    <Heading level="4" size="medium" className="spacing-bottom--medium">
                      <Link href="https://www.dinstartside.no/oversikt-kommuner-norge.php" className="home-page__link">
                        Kontakt din kommune
                      </Link>
                    </Heading>
                    <BodyLong>
                      Finn kontaktinformasjon til din kommune og les om kommunens rolle i oppfølging av hjelpemidler.
                    </BodyLong>
                  </div>
                </HGrid>
                <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
                  <div className="home-page__kontakt-oss-icon">
                    <Chat2Icon aria-hidden fontSize={'32px'} />
                  </div>
                  <div className="spacing-top--small">
                    <Heading level="4" size="medium" className="spacing-bottom--medium">
                      <Link href="https://www.nav.no/kontaktoss" className="home-page__link">
                        Kontakt NAV
                      </Link>
                    </Heading>
                    <BodyLong>Skriv med Chatrobot Frida, skriv til oss, eller ring kontaktsenteret i NAV.</BodyLong>
                  </div>
                </HGrid>
              </HGrid>
            </div>
          </Bleed>
        </VStack>
      </div>
    </AnimateLayout>
  )
}

const InformationNavLinks = () => {
  return (
    <VStack gap={{ xs: '6', md: '8' }}>
      <Heading level="2" size="medium">
        Informasjon på nav.no
      </Heading>
      <VStack gap="7">
        <HGrid gap="6" columns={'57px auto'}>
          <Image src="/arrow.svg" width="57" height="57" alt="Illustrasjon" aria-hidden />
          <Link href="https://www.nav.no/om-hjelpemidler">Informasjon om hjelpemidler og tilrettelegging</Link>
        </HGrid>
        <HGrid gap="6" columns={'57px auto'}>
          <Image src="/arrow.svg" width="57" height="57" alt="Illustrasjon" aria-hidden />
          <Link href="https://www.nav.no/om-hjelpemidler#hvem">Dette må du vite før du søker som privatperson</Link>
        </HGrid>

        <HGrid gap="6" columns={'57px auto'}>
          <Image src="/arrow.svg" width="57" height="57" alt="Illustrasjon" aria-hidden />
          <Link href="https://www.nav.no/soknader">Søknad og skjema for hjelpemidler</Link>
        </HGrid>
        <HGrid gap="6" columns={'57px auto'}>
          <Image src="/arrow.svg" width="57" height="57" alt="Illustrasjon" aria-hidden />
          <Link href="https://www.kunnskapsbanken.net/">Kunnskapsbanken</Link>
        </HGrid>
      </VStack>
    </VStack>
  )
}

export default Home
