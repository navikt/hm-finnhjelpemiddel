'use client'

import { useMemo } from 'react'

import Image from 'next/image'
import NextLink from 'next/link'

import useSWR from 'swr'

import { Bleed, Heading, Hide, HStack, Link, VStack } from '@navikt/ds-react'

import { agreementHasNoProducts, AgreementLabel } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'

import AnimateLayout from '@/components/layout/AnimateLayout'
import News from '@/components/News'
import { logNavigereEvent } from '@/utils/amplitude'
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
    <>
      <AnimateLayout>
        <Bleed marginInline="full" asChild reflectivePadding>
          <div className="main-wrapper--background-blue">
            <VStack className="main-wrapper--large" gap="4">
              <HStack justify={{ xl: 'space-between' }} gap={{ lg: '20' }} className="spacing-top--xlarge">
                <div className="home-page__heading">
                  <Heading level="1" size="large">
                    Finn hjelpemiddel i Norges største samling av hjelpemidler på nett.
                  </Heading>
                </div>
                <Hide below="lg">
                  <Image src="/illustrasjon.svg" width="316" height="173" alt="Illustrasjon" aria-hidden />
                </Hide>
              </HStack>

              <VStack gap={{ xs: '4', md: '8' }}>
                <Heading level="2" size="medium">
                  Hjelpemidler på avtale med NAV
                </Heading>

                <HStack gap="5" className="spacing-bottom--xlarge">
                  {sortedAgreements?.map(({ id, label }) => {
                    //Wish to replace id by label in url
                    let hrefSok = `/sok?agreement&rammeavtale=${label}`
                    return (
                      <div className="home-page__agreement-link" key={id}>
                        <Link
                          as={NextLink}
                          href={`/${id}`}
                          onClick={() => logNavigereEvent('forside', 'hurtigoversikt', label)}
                        >
                          {label}
                        </Link>
                      </div>
                    )
                  })}
                </HStack>
              </VStack>
              <News />
            </VStack>
          </div>
        </Bleed>
      </AnimateLayout>
    </>
  )
}

export default Home
