'use client'

import { useRef } from 'react'
import { Heading, Link, VStack } from '@navikt/ds-react'
import { Agreement } from '@/utils/agreement-util'
import NextLink from 'next/link'
import AccessoriesSparePartsBody from '@/app/rammeavtale/[agreementId]/AccessoriesSparePartsBody'

const SpareParts = ({ agreement }: { agreement: Agreement }) => {
  const headingRef = useRef<HTMLHeadingElement>(null)

  const pageTitle = 'Reservedeler'

  return (
    <VStack className="main-wrapper--large spacing-bottom--large hide-print" gap="4" paddingBlock="4 0">
      <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}`} variant="subtle">
        {`${agreement.title}`}
      </Link>
      <Heading level="1" size="large" className="agreement-page__heading">
        {pageTitle}
      </Heading>
      <AccessoriesSparePartsBody agreement={agreement} itemType={pageTitle.toLowerCase()} />
    </VStack>
  )
}

export default SpareParts
