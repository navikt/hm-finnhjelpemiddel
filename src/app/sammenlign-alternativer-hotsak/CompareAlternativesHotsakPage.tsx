'use client'

import useSWR from 'swr'

import { fetchProductsWithVariant, FetchSeriesResponse } from '@/utils/api-util'
import { Product } from '@/utils/product-util'

import { Heading, Loader } from '@/components/aksel-client'
import { sortProductsOnAgreementPostAndRank } from '@/app/sammenlign/ComparePage'
import { CompareTable } from '@/app/sammenlign/CompareTable'

interface Props {
  productIdsToCompare: string[]
}

export default function CompareAlternativesHotsakPage({ productIdsToCompare }: Props) {
  const { data, isLoading } = useSWR<FetchSeriesResponse>(productIdsToCompare, fetchProductsWithVariant, {
    keepPreviousData: true,
  })

  const productsToCompareWithVariants: Product[] | undefined = data?.products
  const sortedProductsToCompare =
    productsToCompareWithVariants && sortProductsOnAgreementPostAndRank(productsToCompareWithVariants)

  if (isLoading) {
    return (
      <div className="main-wrapper--large compare-page spacing-top--large spacing-bottom--xlarge">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>

        <div id="searchResults" className="results__loader">
          <Loader size="3xlarge" title="Laster produkter" />
        </div>
      </div>
    )
  }

  if (!sortedProductsToCompare || sortedProductsToCompare?.length === 0) {
    return (
      <div className="main-wrapper--large compare-page spacing-top--large spacing-bottom--xlarge">
        <Heading level="1" size="large" spacing>
          Sammenlign produkter
        </Heading>
        <p>Ingen produkter å sammenligne.</p>
      </div>
    )
  }

  return (
    <div className="main-wrapper--xlarge compare-page spacing-top--large spacing-bottom--xlarge">
      <Heading level="1" size="large" spacing>
        Sammenlign produkter
      </Heading>
      <>
        {sortedProductsToCompare && (
          <CompareTable productsToCompare={sortedProductsToCompare} isAlternativeProductsHotsak={true} />
        )}
      </>
    </div>
  )
}
