'use client'

import { useRef } from 'react'

import { BodyLong, Heading } from '@navikt/ds-react'
import { Agreement, agreementHasNoProducts } from '@/utils/agreement-util'

const AgreementDescription = ({ agreement }: { agreement: Agreement }) => {
  const headingRef = useRef<HTMLHeadingElement>(null)

  return (
    <div className="agreement-page__description">
      <Heading level="2" size="small" ref={headingRef}>
        Om avtalen med Nav
      </Heading>

      {!agreementHasNoProducts(agreement.identifier) && (
        <BodyLong>
          {`Nav har avtale med flere leverandører for å kunne tilby et bredt utvalg av hjelpemidler innenfor området "${agreement.title}". På denne siden finner du informasjon om avtalen, dokumenter, tilbehør, eventuelle tjenester og reservedeler. Informasjon om leverandør finner man på siden til hjelpemiddelet.`}
        </BodyLong>
      )}

      <div dangerouslySetInnerHTML={{ __html: agreement.descriptionHtml }} />
    </div>
  )
}

export default AgreementDescription
