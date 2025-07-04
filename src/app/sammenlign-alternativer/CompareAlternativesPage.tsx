'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import useSWR from 'swr'

import { fetchProductsWithVariant, FetchSeriesResponse } from '@/utils/api-util'
import { Product } from '@/utils/product-util'

import { BodyLong, ChevronRightIcon, Heading, Loader } from '@/components/aksel-client'
import {
  CompareAlternativesMenuState,
  useHydratedAlternativeProductsCompareStore,
} from '@/utils/compare-alternatives-state-util'
import { sortProductsOnAgreementPostAndRank } from '@/app/sammenlign/ComparePage'
import { CompareTable } from '../sammenlign/CompareTable'

export default function CompareAlternativesPage() {
  const { alternativeProductsToCompare, setCompareAlternativesMenuState } = useHydratedAlternativeProductsCompareStore()
  const router = useRouter()

  const seriesIDsToCompare = alternativeProductsToCompare.map((product) => product.seriesId)
  const variantIDsToCompare = alternativeProductsToCompare.map((product) => product.id)

  const { data, isLoading } = useSWR<FetchSeriesResponse>(variantIDsToCompare, fetchProductsWithVariant, {
    keepPreviousData: true,
  })

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
    setCompareAlternativesMenuState(CompareAlternativesMenuState.Open)
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
        <>
          {sortedProductsToCompare && (
            <CompareTable productsToCompare={sortedProductsToCompare} isAlternativeProducts={true} />
          )}
        </>
      )}
    </div>
  )
}
