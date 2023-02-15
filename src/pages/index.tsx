import { useEffect, useState } from 'react'
import { InferGetServerSidePropsType, NextPageContext } from 'next'
import useSWRInfinite from 'swr/infinite'
import * as queryString from 'querystring'
import { Loader } from '@navikt/ds-react'
import { CompareMode, useHydratedCompareStore, useSearchDataStore } from '../utils/state-util'
import { fetchProducts, FetchResponse, SelectedFilters } from '../utils/api-util'
import { mapProductSearchParams } from '../utils/product-util'

import AnimateLayout from '../components/layout/AnimateLayout'
import CompareMenu from '../components/compare-products/CompareMenu'
import SearchResults from '../components/search/SearchResults'
import Sidebar from '../components/sidebar/Sidebar'

export const getServerSideProps: (
  context: NextPageContext
) => Promise<{ props: { query: queryString.ParsedUrlQuery } }> = async (context: NextPageContext) => {
  const { query } = context
  return { props: { query } }
}

export default function Home({ query }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { searchData, setSearchData } = useSearchDataStore()
  const { compareMode } = useHydratedCompareStore()

  const [productSearchParams] = useState(mapProductSearchParams(query))

  const { data, size, setSize, isLoading } = useSWRInfinite<FetchResponse>(
    (index) => ({ url: `/product/_search`, pageIndex: index, searchData }),
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

  useEffect(() => setSearchData(productSearchParams), [productSearchParams, setSearchData])

  useEffect(() => {
    window.history.pushState(
      null,
      '',
      '?' +
        queryString.stringify({
          agreement: searchData.hasRammeavtale,
          ...(searchData.searchTerm && { term: searchData.searchTerm }),
          ...(searchData.isoCode && { isoCode: searchData.isoCode }),
          ...Object.entries(searchData.filters)
            .filter(([_, values]) => values.some((value) => !(isNaN(value) || value === null || value === undefined)))
            .reduce((newObject, [key, values]) => ({ ...newObject, [key]: values }), {} as SelectedFilters),
        })
    )
  }, [searchData])

  return (
    <>
      {compareMode === CompareMode.Active && <CompareMenu />}
      <AnimateLayout>
        <div className="main-wrapper">
          <div className="flex-column-wrap">
            <Sidebar filters={data?.at(-1)?.filters} />
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
