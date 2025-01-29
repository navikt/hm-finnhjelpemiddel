import { ReadonlyURLSearchParams } from 'next/navigation'
import { initialFiltersFormState, mapFilters } from './filter-util'
import { FormSearchData, SearchData, initialSearchDataState, isValidSortOrder } from './search-state-util'
import queryString from 'query-string'

export const mapSearchParams = (searchParams: ReadonlyURLSearchParams, agreementSearch?: boolean): SearchData => {
  const sortOrderStr = searchParams.get('sortering') || ''
  const sortOrder = isValidSortOrder(sortOrderStr) ? sortOrderStr : agreementSearch ? undefined : 'Best_soketreff'

  const searchTerm = searchParams.get('term') ?? ''
  const isoCode = searchParams.get('isoCode') ?? ''
  const hidePictures = searchParams.get('hidePictures') ?? ''

  const filterKeys = Object.keys(initialFiltersFormState).filter((filter) => searchParams?.has(filter))

  const filters = filterKeys.reduce(
    (obj, fk) => ({
      ...obj,
      [fk]: searchParams?.getAll(fk),
    }),
    {}
  )
  return {
    sortOrder,
    searchTerm,
    isoCode,
    filters: { ...initialSearchDataState.filters, ...filters },
    hidePictures,
  }
}

export const toSearchQueryString = (searchData: FormSearchData, searchTerm: string) => {
  return queryString.stringify({
    ...(searchData.sortOrder && { sortering: searchData.sortOrder }),
    ...(searchData.hidePictures ? { hidePictures: searchData.hidePictures } : {}),
    ...{ term: searchTerm },
    ...(searchData.isoCode && { isoCode: searchData.isoCode }),
    ...mapFilters(searchData.filters),
  })
}
