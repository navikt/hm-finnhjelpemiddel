'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import useSWR from 'swr'

import { fetchProductsWithVariants, FetchSeriesResponse } from '@/utils/api-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'

import { BodyLong, ChevronRightIcon, Heading, Loader } from '@/components/aksel-client'
import { useEffect, useState } from 'react'
import { CompareTable } from '@/app/sammenlign/CompareTable'

export default function ComparePage() {
  const { productsToCompare, setCompareMenuState } = useHydratedCompareStore()
  const router = useRouter()
  const [shouldFetch, setShouldFetch] = useState(true)

  const seriesIDsToCompare = productsToCompare.map((product) => product.id)

  const { data, isLoading } = useSWR<FetchSeriesResponse>(
    shouldFetch ? seriesIDsToCompare : null,
    fetchProductsWithVariants,
    { keepPreviousData: true }
  )

  useEffect(() => {
    // Check if all products to compare are already fetched
    const allProductsFetched = seriesIDsToCompare.every((serieId) =>
      data?.products.some((product) => product.id === serieId)
    )
    setShouldFetch(!allProductsFetched)
  }, [seriesIDsToCompare, data])

  // Filter out the products from SWR data that are not present in productsToCompare
  const filteredData = data && {
    ...data,
    products: data.products.filter((product) => seriesIDsToCompare.includes(product.id)),
  }

  const productsToCompareWithVariants: Product[] | undefined = filteredData?.products
  const sortedProductsToCompare =
    productsToCompareWithVariants && sortProductsOnAgreementPostAndRank(productsToCompareWithVariants)

  const handleClick = (event: any) => {
    event.preventDefault()
    setCompareMenuState(CompareMenuState.Open)
    router.back()
  }

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

  return (
    <div className="main-wrapper--xlarge compare-page spacing-top--large spacing-bottom--xlarge">
      <Heading level="1" size="large" spacing>
        Sammenlign produkter
      </Heading>

      {sortedProductsToCompare && sortedProductsToCompare.length === 0 ? (
        <section>
          <NextLink
            className="navds-panel navds-link-panel navds-panel--border"
            style={{ maxWidth: '750px' }}
            href={'/sok'}
            onClick={handleClick}
          >
            <div className="navds-link-panel__content">
              <div className="navds-link-panel__title navds-heading navds-heading--medium">
                Legg til produkter for sammenligning
              </div>
              <BodyLong>For å kunne sammenligne produkter må de velges til sammenligning på søkesiden</BodyLong>
            </div>
            <ChevronRightIcon aria-hidden />
          </NextLink>
        </section>
      ) : (
        <>{sortedProductsToCompare && <CompareTable productsToCompare={sortedProductsToCompare} />}</>
      )}
    </div>
  )
}

export function sortProductsOnAgreementPostAndRank(products: Product[]): Product[] {
  return products.sort((a, b) => {
    if (a.agreements.length === 0 && b.agreements.length === 0) {
      return 0
    } else if (a.agreements.length === 0) {
      return 1 // Place products without agreements after products with agreements
    } else if (b.agreements.length === 0) {
      return -1 // Place products without agreements after products with agreements
    } else {
      // Both products have agreements, sort by postNumber, then rank
      const postNumberComparison = a.agreements[0].postNr - b.agreements[0].postNr
      if (postNumberComparison !== 0) {
        return postNumberComparison
      } else {
        return a.agreements[0].rank - b.agreements[0].rank
      }
    }
  })
}
