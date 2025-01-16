'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

import AutocompleteSearch from '@/components/AutocompleteSearch'
import AnimateLayout from '@/components/layout/AnimateLayout'
import NewsList from '@/components/NewsList'
import { logKlikk, logNavigationEvent, logVisit } from '@/utils/amplitude'
import {
  BicycleIcon,
  Chat2Icon,
  EarIcon,
  EyeIcon,
  HatSchoolIcon,
  LocationPinIcon,
  WheelchairIcon,
} from '@navikt/aksel-icons'
import { Bleed, BodyLong, Box, Heading, HGrid, Hide, HStack, Link, Show, VStack } from '@navikt/ds-react'

import AgreementList from './rammeavtale/AgreementList'

function Home() {
  const path = usePathname()
  const router = useRouter()

  useEffect(() => {
    typeof window !== 'undefined' && logVisit(window.location.href, window.document.title)
  }, [])

  const onSearch = useCallback(
    (searchTerm: string) => {
      const qWithFilters = new URLSearchParams(window.location.search)
      const qNoFilters = new URLSearchParams()

      qWithFilters.set('term', searchTerm.trim())
      qNoFilters.set('term', searchTerm.trim())
      if (path.includes('sok')) {
        logNavigationEvent('søk', 'søk', 'Søk på søkesiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path === '/') {
        logNavigationEvent('forside', 'søk', 'Søk på forsiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path.includes('produkt')) {
        router.push('/sok?' + qNoFilters.toString())
      } else {
        logNavigationEvent('annet', 'søk', 'Søk fra annen side')
        router.push('/sok?' + qWithFilters.toString())
      }
    },
    [router, path]
  )

  return (
    <AnimateLayout>
      <div className="home-page">
        <VStack className="main-wrapper--large" gap={{ xs: '12', md: '24' }}>
          <Bleed
            marginInline="full"
            reflectivePadding
            style={{ backgroundColor: '#FEF5EF' }}
            className="home-page__heading-and-search-container"
          >
            <VStack gap={{ xs: '8', md: '11' }}>
              <Box
                paddingInline="10"
                paddingBlock="4"
                style={{ backgroundColor: '#FAD8E7' }}
                width="fit-content"
                className="home-page__icons-logo"
              >
                <HStack gap="4">
                  <WheelchairIcon aria-hidden /> <EyeIcon aria-hidden /> <BicycleIcon aria-hidden />
                  <EarIcon aria-hidden />
                </HStack>
              </Box>
              <VStack gap="2">
                <Heading level="1" size="xlarge" className="home-page__heading home-page__finnhjelpemiddel">
                  FinnHjelpemiddel
                </Heading>
                <Heading level="1" size="xlarge" className="home-page__heading">
                  Norges største samling av hjelpemidler på nett
                </Heading>
              </VStack>
              <Box maxWidth={'530px'}>
                <AutocompleteSearch onSearch={onSearch} />
              </Box>
            </VStack>
          </Bleed>

          <HGrid gap={{ xs: '12', md: '14' }} columns={{ xs: '1fr', md: '2fr 1fr' }}>
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
              <HGrid gap="8" columns={{ xs: 1, md: 3 }}>
                <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
                  <div className="home-page__kontakt-oss-icon">
                    <Chat2Icon aria-hidden fontSize={'32px'} />
                  </div>
                  <div className="spacing-top--small">
                    <Heading level="4" size="small" className="spacing-bottom--medium">
                      <Link href="https://www.nav.no/kontaktoss" className="home-page__link">
                        Kontakt Nav
                      </Link>
                    </Heading>
                    <BodyLong>Skriv med Chatrobot Frida, skriv til oss, eller ring kontaktsenteret i Nav.</BodyLong>
                  </div>
                </HGrid>
                <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
                  <div className="home-page__kontakt-oss-icon">
                    <LocationPinIcon aria-hidden fontSize={'32px'} />
                  </div>
                  <div className="spacing-top--small">
                    <Heading level="4" size="small" className="spacing-bottom--medium">
                      <Link href="https://www.nav.no/kontaktoss#finn-hjelpemiddelsentral" className="home-page__link">
                        Finn din hjelpemiddelsentral
                      </Link>
                    </Heading>
                    <BodyLong>Finn kontaktinformasjon og les om inn- og utlevering av hjelpemidler.</BodyLong>
                  </div>
                </HGrid>

                <HGrid columns={'65px auto'} gap={{ xs: '2', md: '6' }}>
                  <div className="home-page__kontakt-oss-icon">
                    <HatSchoolIcon aria-hidden fontSize={'32px'} />
                  </div>
                  <div className="spacing-top--small">
                    <Heading level="4" size="small" className="spacing-bottom--medium">
                      <Link href="https://www.kunnskapsbanken.net/" className="home-page__link">
                        Kunnskapsbanken
                      </Link>
                    </Heading>
                    <BodyLong>Fagstoff og kurs om hjelpemidler og tilrettelegging.</BodyLong>
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

export default Home
