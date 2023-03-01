import { useEffect, useRef, useState } from 'react'
import { InferGetServerSidePropsType, NextPageContext } from 'next'
import Router from 'next/router'
import useSWRInfinite from 'swr/infinite'
import * as queryString from 'querystring'
import { useHydratedSearchStore } from '../utils/search-state-util'
import { CompareMode, useHydratedCompareStore } from '../utils/compare-state-util'
import { fetchProducts, FetchResponse, SelectedFilters } from '../utils/api-util'
import { mapProductSearchParams, toSearchQueryString } from '../utils/product-util'

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
  const { searchData, setSearchData } = useHydratedSearchStore()
  const { compareMode } = useHydratedCompareStore()

  const [productSearchParams] = useState(mapProductSearchParams(query))
  const [searchInitialized, setSearchInitialized] = useState(false)

  const { data, size, setSize, isLoading } = useSWRInfinite<FetchResponse>(
    (index) => ({ url: `/products/_search`, pageIndex: index, searchData }),
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

  const ref = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    ref.current?.focus()
  }

  useEffect(() => {
    setSearchData(productSearchParams)
    setSearchInitialized(true)
  }, [productSearchParams, setSearchData])

  useEffect(() => {
    if (searchInitialized) {
      Router.push(toSearchQueryString(searchData))
    }
  }, [searchInitialized, searchData])

  return (
    <>
      {compareMode === CompareMode.Active && <CompareMenu />}
      <AnimateLayout>
        <div className="main-wrapper">
          <div className="flex-column-wrap">
            <Sidebar filters={data?.at(-1)?.filters} setFocus={handleClick} />
            <div className="results__wrapper">
              {<SearchResults data={data} size={size} setSize={setSize} isLoading={isLoading} ref={ref} />}
            </div>
          </div>
        </div>
      </AnimateLayout>
    </>
  )
}
