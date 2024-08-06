'use client'

import { useEffect, useRef } from 'react'
import { Heading, Link, VStack } from '@navikt/ds-react'
import { Agreement } from '@/utils/agreement-util'
import NextLink from 'next/link'
import AccessoriesOrSparePartsTable from '@/app/rammeavtale/[agreementId]/AccessoriesOrSparePartsTable'
import { useFlag } from '@/toggles/context'
import { useRouter } from 'next/navigation'

const SpareParts = ({ agreement }: { agreement: Agreement }) => {

  const headingRef = useRef<HTMLHeadingElement>(null)
  const pageTitle = 'Reservedeler'

  const router = useRouter();
  const useNewFeature = useFlag("finnhjelpemiddel.vis-tilbehor-og-reservedel-lister")

  if (useNewFeature.enabled) {
    return (
      <VStack className="main-wrapper--large spacing-bottom--large hide-print" gap="4" paddingBlock="4 0">
        <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}`} variant="subtle">
          {`${agreement.title}`}
        </Link>
        <Heading level="1" size="large" className="agreement-page__heading">
          {pageTitle}
        </Heading>
        <AccessoriesOrSparePartsTable agreement={agreement} itemType={pageTitle.toLowerCase()} />
      </VStack>
    )
  }
  else {
    router.replace(`/rammeavtale/${agreement.id}#Reservedeler`)
  }
}

export default SpareParts
