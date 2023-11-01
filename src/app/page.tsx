'use client'

import React, { useCallback, useMemo, useRef } from 'react'

import Image from 'next/image'
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
    const filteredData = data.filter((agreement) => !agreementHasNoProducts(agreement.identifier))
    // Create a copy of data to avoid modifying it in place
    filteredData.sort((a, b) => {
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

    return filteredData
  }, [data])

  const first15Agreements = sortedData?.slice(0, 15)
  const lastAgreements = sortedData?.slice(15)

  const agreementLink = (id: string, label: string) => {
    let hrefSok = `/sok?agreement=true&rammeavtale=${label}`

    return (
      <div className="home-page__agreement-link" key={id}>
        <NextLink href={hrefSok}>
          <BodyShort> {label} </BodyShort>
        </NextLink>
      </div>
    )
  }

  return (
    <div className="home-page">
      <AnimateLayout>
        <div className="home-page__background-container">
          <div className="home-page__container illustration-container">
            <div className="home-page__heading-and-search">
              <Heading level="1" size="large">
                Søk i Norges største samling av hjelpemidler på nett.
              </Heading>

              <SearchCombobox onSearch={onSearch} initialValue="" />
            </div>
            <Image src="/illustrasjon.svg" width="316" height="173" alt="" aria-hidden={true} />
          </div>
        </div>
        <div className="home-page__background-container red">
          <div className="home-page__container">
            <div className="home-page__agreement-heading">
              <Heading level="2" size="medium" ref={agreementHeadingRef}>
                Hjelpemidler på avtale med NAV
              </Heading>
              <Ingress>
                NAV inngår avtaler med leverandører om kjøp av hjelpemidler. Hver avtale gjelder for en begrenset
                tidsperiode.
              </Ingress>
              <Image src="/nav-logo.svg" width="65" height="41" alt="" aria-hidden={true} />
            </div>

            <div className="home-page__agreement-links-container">
              <div className="home-page__agreement-links">
                {first15Agreements?.map(({ id, label }) => {
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
