import { initialFiltersState, initialNewFiltersFormState } from './filter-util'

export const initialSearchDataState = {
  searchTerm: '',
  isoCode: '',
  hasAgreementsOnly: false,
  filters: initialFiltersState,
  newFilters: initialNewFiltersFormState,
  sortOrder: undefined,
}

export const initialAgreementSearchDataState = {
  searchTerm: '',
  filters: initialFiltersState,
  hidePictures: 'show-pictures',
}
