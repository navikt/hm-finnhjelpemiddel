'use client'

import React, { useRef } from 'react'

import { BodyLong, Heading } from '@navikt/ds-react'

import { Agreement, agreementHasNoProducts } from '@/utils/agreement-util'

import ReadMore from '@/components/ReadMore'

const AgreementDescription = ({ agreement }: { agreement: Agreement }) => {
  const headingRef = useRef<HTMLHeadingElement>(null)

  const setFocusOnHeading = () => {
    headingRef.current && headingRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div className="agreement-page__description">
      <Heading level="2" size="small" ref={headingRef}>
        Om avtalen med NAV
      </Heading>
      {agreementHasNoProducts(agreement.identifier) && (
        <div dangerouslySetInnerHTML={{ __html: agreement.descriptionHtml }} />
      )}
      {!agreementHasNoProducts(agreement.identifier) && (
        <BodyLong>
          {`NAV har avtale med flere leverandører for å kunne tilby et bredt utvalg av hjelpemidler innenfor området "${agreement.title}". På denne siden finner du informasjon om avtalen, dokumenter, tilbehør, eventuelle tjenester og reservedeler. Informasjon om leverandør finner man på siden til hjelpemiddelet.`}
        </BodyLong>
      )}
      {!agreementHasNoProducts(agreement.identifier) && (
        <ReadMore
          content={<div dangerouslySetInnerHTML={{ __html: agreement.descriptionHtml }} />}
          buttonOpen={'Les mer om avtalen'}
          buttonClose={'Les mindre om avtalen'}
          setFocus={setFocusOnHeading}
        />
      )}
    </div>
  )
}

export default AgreementDescription
