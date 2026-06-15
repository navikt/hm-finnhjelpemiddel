'use client'

import { AgreementInfo } from '@/utils/product-util'
import { Heading, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'

export const OtherProductsOnPost = ({ agreements }: { agreements: AgreementInfo[] }) => {
  const sortedAgreements = [...agreements].sort((a, b) => {
    return b.postNr !== a.postNr ? a.postNr - b.postNr : !a.refNr ? -1 : !b.refNr ? 1 : b.refNr.localeCompare(a.refNr)
  })

  return (
    <VStack gap={'space-8'} paddingInline={'space-8 space-0'}>
      <Heading size={'medium'} level={'2'}>
        Andre hjelpemidler på delkontrakt:
      </Heading>
      {sortedAgreements.length > 0 &&
        sortedAgreements.map((agreement, index) => (
          <VStack gap={'space-8'} paddingBlock={'space-8 space-16'} key={index}>
            <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}#${agreement.refNr}`}>
              {agreement.postTitle}
            </Link>
          </VStack>
        ))}
    </VStack>
  )
}
