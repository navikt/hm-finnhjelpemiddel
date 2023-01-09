import create from 'zustand'
import { SearchData } from './api-util'
import { AtLeastOne } from './type-util'

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
