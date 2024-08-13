'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import AccessoriesOrSparePartsTable from '@/app/rammeavtale/[agreementId]/AccessoriesOrSparePartsTable'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { Agreement } from '@/utils/agreement-util'
import { BodyShort, Heading, HStack, Link, Loader, VStack } from '@navikt/ds-react'

const SpareParts = ({ agreement }: { agreement: Agreement }) => {
  const router = useRouter()
  const featureFlags = useFeatureFlags()
  const useNewFeature = featureFlags.isEnabled('finnhjelpemiddel.vis-tilbehor-og-reservedel-lister')

  if (featureFlags.isLoading || useNewFeature === undefined) {
    return <Loader>Loading...</Loader>
  }

  if (useNewFeature === false) {
    router.replace(`/rammeavtale/${agreement.id}#Reservedeler`)
  }

  return (
    <VStack className="main-wrapper--large spacing-vertical--xlarge hide-print" gap="4">
      <HStack gap="3">
        <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}`} variant="subtle">
          {`${agreement.title}`}
        </Link>
        <BodyShort textColor="subtle">/</BodyShort>
      </HStack>
      <Heading level="1" size="large" className="agreement-page__heading">
        Reservedeler
      </Heading>
      <AccessoriesOrSparePartsTable agreement={agreement} isSparepart={true} />
    </VStack>
  )
}

export default SpareParts
