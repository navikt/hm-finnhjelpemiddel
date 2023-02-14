import useSWRInfinite from 'swr/infinite'
import { Loader } from '@navikt/ds-react'
import { CompareMode, useHydratedCompareStore, useSearchDataStore } from '../utils/state-util'
import { fetchProducts, FetchResponse } from '../utils/api-util'

import AnimateLayout from '../components/layout/AnimateLayout'
import CompareMenu from '../components/compare-products/CompareMenu'
import SearchResults from '../components/search/SearchResults'
import Sidebar from '../components/sidebar/Sidebar'

export default function Home() {
  const { searchData } = useSearchDataStore()
  const { compareMode } = useHydratedCompareStore()

  const { data, size, setSize, isLoading } = useSWRInfinite<FetchResponse>(
    (index) => ({ url: `/product/_search`, pageIndex: index, searchData }),
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

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
