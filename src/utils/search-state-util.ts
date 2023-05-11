'use client'
import { create } from 'zustand'
import { useEffect, useState } from 'react'
import { createJSONStorage, persist } from 'zustand/middleware'
import { SearchData } from './api-util'
import { AtLeastOne } from './type-util'
import { FilterCategories } from './filter-util'

const initialFiltersState = {
  beregnetBarn: [],
  breddeCM: [null, null],
  brukervektMaksKG: [null, null],
  brukervektMinKG: [null, null],
  fyllmateriale: [],
  lengdeCM: [null, null],
  materialeTrekk: [],
  setebreddeMaksCM: [null, null],
  setebreddeMinCM: [null, null],
  setedybdeMaksCM: [null, null],
  setehoydeMaksCM: [null, null],
  setehoydeMinCM: [null, null],
  setedybdeMinCM: [null, null],
  totalVektKG: [null, null],
}

export const initialSearchDataState = {
  searchTerm: '',
  isoCode: '',
  hasRammeavtale: true,
  filters: initialFiltersState,
}

type SearchDataState = {
  searchData: SearchData
  setSearchData: (searchData: AtLeastOne<SearchData>) => void
  setFilter: (filterKey: keyof typeof FilterCategories, values: Array<any>) => void
  resetSearchData: () => void
  setShowProductSeriesView: (value: boolean) => void
  meta: { showProductSeriesView: boolean }
}

export const useSearchStore = create<SearchDataState>()(
  persist(
    (set) => ({
      meta: { showProductSeriesView: true },
      searchData: initialSearchDataState,
      setSearchData: (searchData) =>
        set((state) => {
          const updatedSearchData = { ...state.searchData, ...searchData }
          return {
            searchData: updatedSearchData,
          }
        }),
      setFilter: (filterKey, values) =>
        set((state) => ({
          searchData: { ...state.searchData, filters: { ...state.searchData.filters, [filterKey]: values } },
        })),
      resetSearchData: () => set({ searchData: initialSearchDataState }),
      setShowProductSeriesView: (value) => set({ meta: { showProductSeriesView: value } }),
    }),
    {
      name: 'search-data-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

// This a fix to ensure zustand never hydrates the store before React hydrates the page
// otherwise it causes a mismatch between SSR and client render
// see: https://github.com/pmndrs/zustand/issues/1145
// https://github.com/TxnLab/use-wallet/pull/23/commits/f4c13aad62839500066d694a5b0f4a4c24c3c8d3
export const useHydratedSearchStore = ((selector, compare) => {
  const store = useSearchStore(selector, compare)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
    ? store
    : {
        meta: { showProductSeriesView: false },
        searchData: initialSearchDataState,
        setSearchData: () => undefined,
        setFilter: () => undefined,
        resetSearchData: () => undefined,
      }
}) as typeof useSearchStore
