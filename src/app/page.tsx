'use client'

import React, { useCallback, useRef, useState } from 'react'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import { BodyShort, Heading, Ingress } from '@navikt/ds-react'

import { agreementKeyLabels } from '@/utils/agreement-util'

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

  let first9Agreements = Object.entries(agreementKeyLabels)
  const lastAgreements = first9Agreements.splice(10)

  const agreementLink = (key: string, value: string) => {
    let hrefAgreement = `/rammeavtale/${key}`

    return (
      <div className="home-page__agreement-link" key={key}>
        <NextLink href={hrefAgreement}>
          <BodyShort> {value} </BodyShort>
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
                hjelpemidler. Les mer om avtalene ved å trykke på lenkene under.
              </Ingress>
            </div>
            <div>
              <div className="home-page__agreement-links spacing-bottom--medium">
                {first9Agreements.map(([key, value]) => {
                  return agreementLink(key, value)
                })}
              </div>
              <ReadMore
                content={
                  <div className="home-page__agreement-links read-more-content">
                    {lastAgreements.map(([key, value]) => {
                      return agreementLink(key, value)
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
