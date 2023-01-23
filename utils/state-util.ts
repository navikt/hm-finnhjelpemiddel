import create from 'zustand'
import { SearchData } from './api-util'
import { AtLeastOne } from './type-util'

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
}

export const useSearchDataStore = create<SearchDataState>()((set) => ({
  searchData: initialSearchDataState,
  setSearchData: (searchData) => set((state) => ({ searchData: { ...state.searchData, ...searchData } })),
  resetSearchData: () => {
    set({ searchData: initialSearchDataState })
  },
}))
