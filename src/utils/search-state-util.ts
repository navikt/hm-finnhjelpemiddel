import { FilterFormState, initialFiltersFormState } from './filter-util'

export const initialSearchDataState = {
  searchTerm: '',
  isoCode: '',
  filters: initialFiltersFormState,
  sortOrder: undefined,
}

export const initialAgreementSearchDataState = {
  searchTerm: '',
  filters: initialFiltersFormState,
  newFilters: initialFiltersFormState,
  hidePictures: 'show-pictures',
}

export const sortOrders = ['Delkontrakt_rangering', 'Best_soketreff'] as const

export type SortOrder = (typeof sortOrders)[number]

export function isValidSortOrder(sortOrder: string): sortOrder is SortOrder {
  return sortOrders.includes(sortOrder as SortOrder)
}

export type SearchData = {
  searchTerm: string
  isoCode: string
  filters: FilterFormState
  sortOrder?: SortOrder
  hidePictures?: string
}

export type FormSearchData = Omit<SearchData, 'searchTerm'>
