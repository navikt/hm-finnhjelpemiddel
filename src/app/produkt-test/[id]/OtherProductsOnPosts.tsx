'use client'

import { ProductCard } from '@/app/produkt/ProductCard'

import React from 'react'

import NextLink from 'next/link'

import useSWRImmutable from 'swr/immutable'

import { ArrowRightIcon } from '@navikt/aksel-icons'
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
        Andre hjelpemidler på delkontrakt
      </Heading>
      {sortedAgreements.length > 0 &&
        sortedAgreements.map((agreement) => (
          <OtherProductsOnPost agreement={agreement} seriesId={product.id} key={agreement.postTitle} />
        ))}
    </VStack>
  )
}

const OtherProductsOnPost = ({ agreement, seriesId }: { agreement: AgreementInfo; seriesId: string }) => {
  const { data } = useSWRImmutable<FetchSeriesResponse>(
    { postTitle: agreement.postTitle, seriesId: seriesId },
    fetchOtherProductsOnPost
  )

  if (!data) {
    return <></>
  }

  return (
    <VStack gap={'space-8'} paddingBlock={'space-8 space-16'} align={'start'}>
      <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}#${agreement.refNr}`}>
        {agreement.postTitle}
      </Link>

      <HStack gap={'space-24'} paddingBlock={'space-0 space-8'}>
        {agreement.postTitle &&
          data.products
            .sort((a, b) => {
              if (agreement.postTitle === '') {
                return 0
              }

              return (
                (a.agreements.find((agreement) => agreement.postTitle === agreement.postTitle)?.rank ?? 0) -
                (b.agreements.find((agreement) => agreement.postTitle === agreement.postTitle)?.rank ?? 0)
              )
            })
            .slice(0, 3)
            .map((product) => (
              <ProductCard
                product={product}
                rank={
                  product.agreements &&
                  product.agreements.find((agreement) => agreement.postTitle === agreement.postTitle)?.rank
                }
                key={product.id}
              />
            ))}
        {data.products.length > 3 && (
          <Link as={NextLink} href={`/rammeavtale/hjelpemidler/${agreement.id}#${agreement.refNr}`}>
            Se flere <ArrowRightIcon aria-hidden fontSize={'24px'} />
          </Link>
        )}
      </HStack>
    </VStack>
  )
}
