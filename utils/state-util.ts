import create from 'zustand'
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

type ProductCompareState = {
  showProductsToCompare: boolean
  toggleShowProductsToCompare: () => void
  productsToCompare: Product[]
  setProductToCompare: (product: Product) => void
  removeProduct: (product: Product) => void
  resetProductToCompare: () => void
}

export const useProducCompareDataStore = create<ProductCompareState>()((set) => ({
  showProductsToCompare: false,
  toggleShowProductsToCompare: () => set((state) => ({ showProductsToCompare: !state.showProductsToCompare })),
  productsToCompare: [],
  setProductToCompare: (product) => set((state) => ({ productsToCompare: state.productsToCompare.concat(product) })),
  removeProduct: (product) =>
    set((state) => ({ productsToCompare: state.productsToCompare.filter((prod) => prod.id === product.id) })),
  resetProductToCompare: () => {
    set({ productsToCompare: [] })
  },
}))
