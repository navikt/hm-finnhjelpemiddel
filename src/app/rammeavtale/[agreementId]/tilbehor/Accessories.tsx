'use client'

import { useRef } from 'react'
import { Heading, Link, VStack } from '@navikt/ds-react'
import { Agreement } from '@/utils/agreement-util'
import NextLink from 'next/link'
import AccessoriesSparePartsBody from '@/app/rammeavtale/[agreementId]/AccessoriesSparePartsBody'

const Accessories = ({ agreement }: { agreement: Agreement }) => {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const pageTitle = 'Tilbehør'

  return (
    <VStack className="main-wrapper--large spacing-bottom--large hide-print" gap="4" paddingBlock="4 0">
      <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}`} variant="subtle">
        {`${agreement.title}`}
      </Link>
      <Heading level="1" size="large" className="agreement-page__heading">
        {pageTitle}
      </Heading>
      <span>
        Tilbehør er deler som endrer hovedproduktets funksjon. Tilbehør kan monteres i tillegg til, eller i stedet for
        en del som er påmontert i en standard utgave av hovedproduktet.
      </span>
      <AccessoriesSparePartsBody agreement={agreement} itemType={pageTitle.toLowerCase()} />
    </VStack>
  )
}

export default Accessories
