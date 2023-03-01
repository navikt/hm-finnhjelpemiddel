import { useEffect, useState } from 'react'
import { InferGetServerSidePropsType, NextPageContext } from 'next'
import Router from 'next/router'
import useSWRInfinite from 'swr/infinite'
import { Loader } from '@navikt/ds-react'
import { initialSearchDataState, useHydratedSearchStore } from '../utils/search-state-util'
import { CompareMode, useHydratedCompareStore } from '../utils/compare-state-util'
import { fetchProducts, FetchResponse, PAGE_SIZE, SearchParams } from '../utils/api-util'
import { mapProductSearchParams, toSearchQueryString } from '../utils/product-util'

import AnimateLayout from '../components/layout/AnimateLayout'
import CompareMenu from '../components/compare-products/CompareMenu'
import SearchResults from '../components/search/SearchResults'
import Sidebar from '../components/sidebar/Sidebar'

export const getServerSideProps: (
  context: NextPageContext
) => Promise<{ props: { searchParams: SearchParams } }> = async (context: NextPageContext) => {
  const { query } = context
  return { props: { searchParams: mapProductSearchParams(query) } }
}

export default function Home({ searchParams }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { searchData, setSearchData } = useHydratedSearchStore()
  const { compareMode } = useHydratedCompareStore()

  const [initialProductSearchParams, setInitialProductSearchParams] = useState(searchParams)
  const [searchInitialized, setSearchInitialized] = useState(false)

  const { data, size, setSize, isLoading } = useSWRInfinite<FetchResponse>(
    (index) => {
      const from = index !== 0 ? (initialProductSearchParams.to || PAGE_SIZE) + (index - 1) * PAGE_SIZE : 0
      const to = (index === 0 && initialProductSearchParams.to) || PAGE_SIZE
      return {
        url: `/products/_search`,
        from,
        to,
        searchData,
      }
    },
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

  useEffect(() => setSearchData(initialProductSearchParams), [initialProductSearchParams, setSearchData])

  useEffect(() => setSearchInitialized(true), [data])

  const products = data?.flatMap((d) => d.products)
  const numberOfProducts = products && products.length > PAGE_SIZE ? products.length : undefined

  useEffect(() => {
    if (searchInitialized) {
      Router.push(
        toSearchQueryString({
          ...searchData,
          to: numberOfProducts,
        }),
        undefined,
        {
          scroll: false,
        }
      )
    }
  }, [searchInitialized, searchData, numberOfProducts])

  return (
    <>
      {compareMode === CompareMode.Active && <CompareMenu />}
      <AnimateLayout>
        <div className="main-wrapper">
          <div className="flex-column-wrap">
            <Sidebar
              filters={data?.at(-1)?.filters}
              onResetSearchData={() => {
                setInitialProductSearchParams({ ...initialSearchDataState, to: undefined })
                setSize(1)
              }}
            />
            <div className="results__wrapper">
              {!data && <Loader className="results__loader" size="3xlarge" title="Laster produkter" />}
              {data && <SearchResults data={data} size={size} setSize={setSize} isLoading={isLoading} />}
            </div>
          </div>
        </div>
      </AnimateLayout>
    </>
  )
}
