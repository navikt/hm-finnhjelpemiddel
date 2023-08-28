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
    <div className="agreement-description">
      <Heading level="2" size="small" ref={headingRef}>
        Om avtalen med NAV
      </Heading>
      {agreementHasNoProducts(agreement.identifier) && (
        <div dangerouslySetInnerHTML={{ __html: agreement.descriptionHtml }} />
      )}
      {!agreementHasNoProducts(agreement.identifier) && (
        <BodyLong>
          {`NAV har avtale med flere leverandører for å kunne skaffe et bredt utvalg av produkter innenfor området "${agreement.title}" til
  innbyggerne våres. På denne siden finner du alle produktene som inngår i denne avtalen og dokumenter som
  hører til avtalen. Informasjon om leverandør finner man på
  siden til produktene.`}
        </BodyLong>
      )}
      {!agreementHasNoProducts(agreement.identifier) && (
        <ReadMore
          content={<div dangerouslySetInnerHTML={{ __html: agreement.descriptionHtml }} />}
          buttonOpen={'Vis alle avtaler'}
          buttonClose={'Les mindre om avtalen'}
          setFocus={setFocusOnHeading}
        />
      )}
    </div>
  )
}

export default AgreementDescription
