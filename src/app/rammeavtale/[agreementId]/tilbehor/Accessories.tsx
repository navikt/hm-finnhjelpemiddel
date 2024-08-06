'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

import AccessoriesOrSparePartsTable from '@/app/rammeavtale/[agreementId]/AccessoriesOrSparePartsTable'
import { useFlag } from '@/toggles/context'
import { Agreement } from '@/utils/agreement-util'
import { BodyShort, Heading, HStack, Link, VStack } from '@navikt/ds-react'

const Accessories = ({ agreement }: { agreement: Agreement }) => {
  const headingRef = useRef<HTMLHeadingElement>(null)

  const router = useRouter()
  const useNewFeature = useFlag('finnhjelpemiddel.vis-tilbehor-og-reservedel-lister')

  if (useNewFeature.enabled) {
    return (
      <VStack className="main-wrapper--large spacing-vertical--xlarge hide-print" gap="4">
        <HStack gap="3">
          <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}`} variant="subtle">
            {`${agreement.title}`}
          </Link>
          <BodyShort textColor="subtle">/</BodyShort>
        </HStack>
        <Heading level="1" size="large" className="agreement-page__heading">
          Tilbehør
        </Heading>
        <AccessoriesOrSparePartsTable agreement={agreement} isSparepart={false} />
      </VStack>
    )
  } else {
    router.push(`/rammeavtale/${agreement.id}#Tilbehor`)
  }
}

export default Accessories
