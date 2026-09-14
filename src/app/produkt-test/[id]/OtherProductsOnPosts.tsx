'use client'

import { ProductCardSearch } from '@/app/sok/ProductCardSearch'

import NextLink from 'next/link'

import useSWRImmutable from 'swr/immutable'

import { HStack, Heading, Link, VStack } from '@navikt/ds-react'

import { FetchSeriesResponse, fetchOtherProductsOnPost } from '@/utils/api-util'
import { AgreementInfo, Product } from '@/utils/product-util'

export const OtherProductsOnPosts = ({ product }: { product: Product }) => {
  const agreements = product.agreements

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
          <OtherProductsOnPost agreement={agreement} seriesId={product.id} key={agreement.id} />
        ))}
    </VStack>
  )
}

const OtherProductsOnPost = ({ agreement, seriesId }: { agreement: AgreementInfo; seriesId: string }) => {
  const { data } = useSWRImmutable<FetchSeriesResponse>(
    { postTitle: agreement.postTitle, seriesId: seriesId },
    fetchOtherProductsOnPost
  )

  return (
    <VStack gap={'space-8'} paddingBlock={'space-8 space-16'}>
      <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}#${agreement.refNr}`}>
        {agreement.postTitle}
      </Link>
      <HStack gap={'space-24'}>
        {data?.products.map((product) => (
          <ProductCardSearch
            product={product}
            rank={product.agreements.find((agreement) => agreement.postTitle === agreement.postTitle)?.rank}
            key={product.id}
          />
        ))}
      </HStack>
    </VStack>
  )
}
