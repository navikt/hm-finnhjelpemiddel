'use client'

import { useRef } from 'react'
import { Heading, Link, VStack } from '@navikt/ds-react'
import { Agreement } from '@/utils/agreement-util'
import NextLink from 'next/link'
import AccessoriesOrSparePartsTable from '@/app/rammeavtale/[agreementId]/AccessoriesOrSparePartsTable'
import { useFlag } from '@/toggles/context'
import { useRouter } from 'next/navigation'

const Accessories = ({ agreement }: { agreement: Agreement }) => {

  const headingRef = useRef<HTMLHeadingElement>(null)

  const router = useRouter();
  const useNewFeature = useFlag("finnhjelpemiddel.vis-tilbehor-og-reservedel-lister")

  if (useNewFeature.enabled) {
    return (
      <VStack className="main-wrapper--large spacing-vertical--xlarge hide-print" gap="4">
        <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}`} variant="subtle">
          {`${agreement.title}`}
        </Link>
        <Heading level="1" size="large" className="agreement-page__heading">
          Tilbehør
        </Heading>
        <AccessoriesOrSparePartsTable agreement={agreement} isSparepart={false} />
      </VStack>
    )
  }
  else {
    router.push(`/rammeavtale/${agreement.id}#Tilbehor`)
  }
}

export default Accessories
