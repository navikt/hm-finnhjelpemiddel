'use client'
import { create } from 'zustand'
import { useState, useEffect } from 'react'
import { persist, createJSONStorage } from 'zustand/middleware'
import deepEqual from 'deep-equal'
import { SearchData } from './api-util'
import { AtLeastOne } from './type-util'
import { Product } from './product-util'

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
  resetSearchData: () => void
  meta: { isUnlikeInitial: boolean }
}

export const useSearchDataStore = create<SearchDataState>()((set) => ({
  meta: { isUnlikeInitial: false },
  searchData: initialSearchDataState,
  setSearchData: (searchData) =>
    set((state) => {
      const updatedSearchData = { ...state.searchData, ...searchData }
      return {
        searchData: updatedSearchData,
        meta: { isUnlikeInitial: !deepEqual(initialSearchDataState, updatedSearchData) },
      }
    }),
  resetSearchData: () => {
    set({ searchData: initialSearchDataState, meta: { isUnlikeInitial: false } })
  },
}))

export enum CompareMode {
  Active = 'Active',
  Deactivated = 'Deactivated',
}

export enum CompareMenuState {
  Open = 'Open',
  Minimized = 'Minimized',
}

type ProductCompareState = {
  compareMode: CompareMode
  setCompareMode: (mode: CompareMode) => void
  compareMenuState: CompareMenuState
  setCompareMenuState: (state: CompareMenuState) => void
  productsToCompare: Product[]
  setProductToCompare: (product: Product) => void
  removeProduct: (product: Product) => void
  resetProductToCompare: () => void
}

export const useProducCompareDataStore = create<ProductCompareState>()(
  persist(
    (set) => ({
      compareMode: CompareMode.Deactivated,
      setCompareMode: (mode) => set(() => ({ compareMode: mode })),
      compareMenuState: CompareMenuState.Open,
      setCompareMenuState: (menuState) => set(() => ({ compareMenuState: menuState })),
      productsToCompare: [],
      setProductToCompare: (product) =>
        set((state) => ({ productsToCompare: state.productsToCompare.concat(product) })),
      removeProduct: (product) =>
        set((state) => ({ productsToCompare: state.productsToCompare.filter((prod) => prod.id !== product.id) })),
      resetProductToCompare: () => {
        set({ productsToCompare: [] })
      },
    }),
    {
      name: 'compare-storage', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

const initialProductCompareState: ProductCompareState = {
  compareMode: CompareMode.Deactivated,
  setCompareMode: (mode: CompareMode) => {},
  compareMenuState: CompareMenuState.Open,
  setCompareMenuState: (menuState: CompareMenuState) => {},
  productsToCompare: [],
  setProductToCompare: (product: Product) => {},
  removeProduct: (product: Product) => {},
  resetProductToCompare: () => {},
}

// This a fix to ensure zustand never hydrates the store before React hydrates the page
// otherwise it causes a mismatch between SSR and client render
// see: https://github.com/pmndrs/zustand/issues/1145
// https://github.com/TxnLab/use-wallet/pull/23/commits/f4c13aad62839500066d694a5b0f4a4c24c3c8d3
export const useHydratedCompareStore = () => {
  const store = useProducCompareDataStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  return hydrated ? store : initialProductCompareState
}
