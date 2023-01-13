import { create } from 'zustand'
import { useState, useEffect } from 'react'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SearchData } from './api-util'
import { AtLeastOne } from './type-util'
import { Product } from './product-util'

const initialFiltersState = {
  beregnetBarn: [],
  breddeCM: [],
  brukervektMaksKG: [],
  brukervektMinKG: [],
  fyllmateriale: [],
  lengdeCM: [],
  materialeTrekk: [],
  setebreddeMaksCM: [],
  setebreddeMinCM: [],
  setedybdeMaksCM: [],
  setehoydeMaksCM: [],
  setehoydeMinCM: [],
  setedybdeMinCM: [],
  totalVektKG: [],
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
}

export const useSearchDataStore = create<SearchDataState>()((set) => ({
  searchData: initialSearchDataState,
  setSearchData: (searchData) => set((state) => ({ searchData: { ...state.searchData, ...searchData } })),
  resetSearchData: () => {
    set({ searchData: initialSearchDataState })
  },
}))

export enum CompareMode {
  Acitve = 'Acitve',
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

// This a fix to ensure zustand never hydrates the store before React hydrates the page
// otherwise it causes a mismatch between SSR and client render
// see: https://github.com/pmndrs/zustand/issues/1145
// https://github.com/TxnLab/use-wallet/pull/23/commits/f4c13aad62839500066d694a5b0f4a4c24c3c8d3
export const useHydratedPCStore = () => {
  const store = useProducCompareDataStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  return hydrated ? store : initialProductCompareState
}
