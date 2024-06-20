'use client'

import { useMemo } from 'react'

import Image from 'next/image'
import NextLink from 'next/link'

import useSWR from 'swr'

import { BodyLong, Box, Heading, HGrid, Hide, HStack, Link, VStack } from '@navikt/ds-react'

import { agreementHasNoProducts, AgreementLabel, agreementProductsLink } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'

import AnimateLayout from '@/components/layout/AnimateLayout'
import News from '@/components/News'
import { logNavigationEvent } from '@/utils/amplitude'
import { sortAlphabetically } from '@/utils/sort-util'

function Home() {
  const { data: agreements } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
  })

  const sortedAgreements = useMemo(() => {
    if (!agreements) return []
    const filteredData = agreements.filter((agreement) => !agreementHasNoProducts(agreement.identifier))
    // Create a copy of data to avoid modifying it in place
    filteredData.sort((a, b) => sortAlphabetically(a.label, b.label))

    return filteredData
  }, [agreements])

  return (
    <AnimateLayout>
      <div className="main-wrapper home-page">
        <VStack className="main-wrapper--large" gap={{ xs: '12', lg: '20' }}>
          <HStack gap={{ xs: '10', lg: '20' }}>
            <Hide below="lg">
              <Image src="/holding-hands-logo.svg" width="180" height="180" alt="Illustrasjon" aria-hidden />
            </Hide>

            <Heading level="1" size="large" className="home-page__heading">
              Finn hjelpemiddel i Norges største samling av hjelpemidler på nett.
            </Heading>
          </HStack>

          <VStack gap={{ xs: '6', md: '10' }}>
            <Heading level="2" size="medium">
              Hjelpemidler på avtale med NAV
            </Heading>

            <HStack gap="5">
              {sortedAgreements?.map(({ id, label }) => {
                //Wish to replace id by label in url
                let hrefSok = `/sok?agreement&rammeavtale=${label}`
                return (
                  <div className="home-page__agreement-link" key={id}>
                    <Link
                      as={NextLink}
                      href={agreementProductsLink(id)}
                      onClick={() => logNavigationEvent('forside', 'hurtigoversikt', label)}
                      className="home-page__link"
                    >
                      {label}
                    </Link>
                  </div>
                )
              })}
            </HStack>
          </VStack>
          <VStack align="center" gap={{ xs: '6', md: '10' }}>
            <Heading level="2" size="medium" align="center">
              Trenger du mer informasjon?
            </Heading>
            <HGrid gap="8" columns={{ xs: 1, md: 'repeat(3, minmax(0, 19rem))' }} className="home-page__links">
              <Box padding="4">
                <Heading level="3" size="small" className="spacing-bottom--small">
                  <Link href="https://www.nav.no/hjelpemidler" className="home-page__link">
                    nav.no/hjelpemidler
                  </Link>
                </Heading>
                <BodyLong>Generell informasjon om hvem som kan få hjelpemidler og hvordan man søker.</BodyLong>
              </Box>
              <Box padding="4">
                <Heading level="3" size="small" className="spacing-bottom--small">
                  <Link href="https://www.kunnskapsbanken.net/" className="home-page__link">
                    Kunnskapsbanken
                  </Link>
                </Heading>
                <BodyLong>Fagstoff og kurs innen hjelpemidler og tilrettelegging.</BodyLong>
              </Box>
              <Box padding="4">
                <Heading level="3" size="small" className="spacing-bottom--small">
                  <Link href="https://www.kunnskapsbanken.net/produktvideoer/" className="home-page__link">
                    Produktvideoer
                  </Link>
                </Heading>
                <BodyLong>{`Videoer av hjelpemidler på avtale med NAV. (Kunnskapsbanken)`}</BodyLong>
              </Box>
            </HGrid>
          </VStack>
          <News />
        </VStack>
      </div>
    </AnimateLayout>
  )
}

export default Home
