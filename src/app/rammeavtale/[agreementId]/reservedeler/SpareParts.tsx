'use client'

import { useEffect, useRef } from 'react'
import { Heading, Link, VStack } from '@navikt/ds-react'
import { Agreement } from '@/utils/agreement-util'
import NextLink from 'next/link'
import AccessoriesSparePartsBody from '@/app/rammeavtale/[agreementId]/AccessoriesSparePartsBody'
import { useFlag } from '@/toggles/context'
import { useRouter } from 'next/navigation'

const SpareParts = ({ agreement }: { agreement: Agreement }) => {

  const headingRef = useRef<HTMLHeadingElement>(null)
  const pageTitle = 'Reservedeler'

  const router = useRouter();
  const shoulRedirect = useFlag("finnhjelpemiddel.vis-tilbehor-og-reservedel-lister")


  if (shoulRedirect) { router.push(`/rammeavtale/${agreement.id}#Reservedeler`) }
  else {
    return (
      <VStack className="main-wrapper--large spacing-bottom--large hide-print" gap="4" paddingBlock="4 0">
        <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}`} variant="subtle">
          {`${agreement.title}`}
        </Link>
        <Heading level="1" size="large" className="agreement-page__heading">
          {pageTitle}
        </Heading>
        <span>
          Reservedeler er deler som ikke endrer hovedproduktets funksjon, men som erstatter en utslitt eller ødelagt del
          på et produkt i standard utgave. De delene tilbehøret består av er også reservedeler.
        </span>
        <AccessoriesSparePartsBody agreement={agreement} itemType={pageTitle.toLowerCase()} />
      </VStack>
    )
  }

}

export default SpareParts
