import create from 'zustand'
import { initialFiltersState } from './filter-util'
import { SearchData } from './api-util'
import { AtLeastOne } from './type-util'

const initialState = {
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
  searchData: initialState,
  setSearchData: (searchData) => set((state) => ({ searchData: { ...state.searchData, ...searchData } })),
  resetSearchData: () => {
    set({ searchData: initialState })
  },
}))
