'use client'

import React, { useCallback, useMemo, useRef } from 'react'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import useSWR from 'swr'

import { BodyShort, Heading, Ingress } from '@navikt/ds-react'

import { AgreementLabel, agreementHasNoProducts, agreementKeyLabels } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'

import ReadMore from '@/components/ReadMore'
import AnimateLayout from '@/components/layout/AnimateLayout'

import SearchCombobox from './sok/sidebar/internals/SearchCombobox'

function Home() {
  const router = useRouter()
  const agreementHeadingRef = useRef<HTMLHeadingElement>(null)

  const setFocusOnHeading = () => {
    agreementHeadingRef.current && agreementHeadingRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const onSearch = useCallback(
    (searchTerm: string) => {
      router.push('/sok?term=' + searchTerm)
    },
    [router]
  )

  //TODO: What to do if error?
  const { data, error } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
  })

  const sortedData = useMemo(() => {
    if (!data) return []
    const sorted = [...data] // Create a copy of data to avoid modifying it in place
    sorted.sort((a, b) => {
      const labelA = agreementKeyLabels[a.identifier]
      const labelB = agreementKeyLabels[b.identifier]

      if (labelA && labelB) {
        const orderA = Object.keys(agreementKeyLabels).indexOf(a.identifier)
        const orderB = Object.keys(agreementKeyLabels).indexOf(b.identifier)
        return orderA - orderB
      } else {
        // Handle cases where identifier does not exist in agreementKeyLabels
        return 0 // No change in order
      }
    })
    return sorted
  }, [data])

  const first10Agreements = sortedData?.slice(0, 10)
  const lastAgreements = sortedData?.slice(10)

  const agreementLink = (id: string, label: string) => {
    let hrefAgreement = `/rammeavtale/${id}`

    return (
      <div className="home-page__agreement-link" key={id}>
        <NextLink href={hrefAgreement}>
          <BodyShort> {label} </BodyShort>
        </NextLink>
      </div>
    )
  }

  return (
    <div className="home-page">
      <AnimateLayout>
        <div className="home-page__background-container blue">
          <div className="home-page__search-container">
            <div className="home-page__heading">
              <Heading level="1" size="xlarge" spacing>
                Finn informasjon om hjelpemidler
              </Heading>
              <Ingress>Finn informasjon om hjelpemidler i Norges største samling av hjelpemidler på nett.</Ingress>
            </div>
            <div className="home-page__input">
              <SearchCombobox onSearch={onSearch} initialValue="" />
            </div>
          </div>
        </div>
        <div className="home-page__background-container red">
          <div className="polygon-shape"></div>
          <div className="home-page__agreement-container">
            <div className="home-page__heading">
              <Heading level="2" size="large" spacing ref={agreementHeadingRef}>
                Produkter på avtale med NAV
              </Heading>
              <Ingress>
                NAV kjøper og eier hjelpemidlene som formidles gjennom hjelpemiddelsentralene. På noen produktområder
                inngår NAV rammeavtaler med leverandørene. Produktene i rammeavtalene er det nasjonale sortimentet av
                hjelpemidler. Les mer om avtalene ved å trykke på lenkene nedenfor.
              </Ingress>
            </div>

            <div>
              <div className="home-page__agreement-links spacing-bottom--medium">
                {first10Agreements?.map(({ id, label }) => {
                  return agreementLink(id, label)
                })}
              </div>
              <ReadMore
                content={
                  <div className="home-page__agreement-links read-more-content">
                    {lastAgreements?.map(({ id, label }) => {
                      return agreementLink(id, label)
                    })}
                  </div>
                }
                buttonOpen={'Vis alle avtaler'}
                buttonClose={'Skjul visning av alle avtaler'}
                setFocus={setFocusOnHeading}
              />
            </div>
          </div>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default Home
