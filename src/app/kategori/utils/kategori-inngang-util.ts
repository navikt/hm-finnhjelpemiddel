import {
  filterLeverandor,
  filterMainProductsOnly,
  filterMinMax,
  filterNotExpiredOnly,
  filterPrefixIsoKode,
} from '@/utils/filter-util'
import { SortOrder } from '@/utils/search-state-util'
import { mapProductsFromCollapse, Product } from '@/utils/product-util'
import { Hit } from '@/utils/response-types'
import { makeSearchTermQuery, QueryObject, sortOptionsOpenSearch } from '@/utils/api-util'

//if HM_SEARCH_URL is undefined it means that we are on the client and we want to use relative url
const HM_SEARCH_URL = process.env.HM_SEARCH_URL || ''
export const PAGE_SIZE = 24

export type IsoInfo = {
  code: string
  name: string
}

export type SupplierInfo = {
  name: string
}

export type MeasurementInfo = {
  [key: string]: {
    key: keyof SearchFiltersKategori
    value: number
  }
}

export type ProductsWithIsoAggs = {
  products: Product[]
  iso: IsoInfo[]
  suppliers: SupplierInfo[]
  measurementFilters?: MeasurementInfo
}

export type SearchFiltersKategori = {
  suppliers: string[]
  isos: string[]
  Setebredde?: string
  Setedybde?: string
  Setehoyde?: string
}

export type CategoryFilter = {
  fieldName: string
  filterDataType: FilterDataType
  searchFields: string | MinMaxFields
}

export type MinMaxFields = {
  min: string
  max: string
}

export enum FilterDataType {
  singleValue,
  minMax,
}

export const categoryFilters: CategoryFilter[] = [
  {
    fieldName: 'Setebredde',
    filterDataType: FilterDataType.minMax,
    searchFields: { min: 'setebreddeMinCM', max: 'setebreddeMaxCM' },
  },
  {
    fieldName: 'Setedybde',
    filterDataType: FilterDataType.minMax,
    searchFields: { min: 'setedybdeMinCM', max: 'setedybdeMaxCM' },
  },
  {
    fieldName: 'Setehøyde',
    filterDataType: FilterDataType.minMax,
    searchFields: { min: 'setehoydeMinCM', max: 'setehoydeMaxCM' },
  },
]

export type SearchDataKategori = {
  isoCode?: string
  sortOrder?: SortOrder
  filterValues?: SearchFiltersKategori
}

type FetchProps = {
  from: number
  size: number
  searchData: SearchDataKategori
  kategoriIsos: string[]
  dontCollapse?: boolean
}

export const fetchProductsKategori = async ({
  from,
  size,
  searchData,
  kategoriIsos,
}: FetchProps): Promise<ProductsWithIsoAggs> => {
  const { sortOrder, filterValues } = searchData
  const sortOrderOpenSearch = sortOrder ? sortOptionsOpenSearch[sortOrder] : sortOptionsOpenSearch['Rangering']
  const searchTermQuery = makeSearchTermQuery({ searchTerm: '' })
  const visTilbDeler = false

  const queryFilters: Array<any> = []
  const postFilters: Array<any> = []

  const filtersFromAdmin = ['Setebredde', 'Setedybde', 'Setehøyde']

  const relevantFilters = categoryFilters.filter((categoryFilter) =>
    filtersFromAdmin.includes(categoryFilter.fieldName)
  )

  if (filterValues?.isos) {
    postFilters.push(filterPrefixIsoKode(filterValues.isos))
  }

  if (filterValues?.suppliers) {
    postFilters.push(filterLeverandor(filterValues.suppliers))
  }

  relevantFilters.forEach((filter) => {})

  if (filtersFromAdmin.includes('Setebredde') && filterValues?.Setebredde) {
    postFilters.push(
      filterMinMax({ setebreddeMinCM: filterValues.Setebredde }, { setebreddeMaksCM: filterValues.Setebredde })
    )
  }
  if (filtersFromAdmin.includes('Setedybde') && filterValues?.Setedybde) {
    postFilters.push(
      filterMinMax({ setedybdeMinCM: filterValues.Setedybde }, { setedybdeMaksCM: filterValues.Setedybde })
    )
  }
  if (filtersFromAdmin.includes('Setehøyde') && filterValues?.Setehoyde) {
    postFilters.push(
      filterMinMax({ setehoydeMinCM: filterValues.Setehoyde }, { setehoydeMaksCM: filterValues.Setehoyde })
    )
  }

  if (kategoriIsos.length > 0) {
    queryFilters.push(filterPrefixIsoKode(kategoriIsos))
  }

  if (!visTilbDeler) {
    queryFilters.push(filterMainProductsOnly())
  }

  queryFilters.push(filterNotExpiredOnly())

  const query = {
    bool: {
      ...searchTermQuery,
      filter: queryFilters,
    },
  }

  const aggsFilter = (filterKey: string, aggs: {}, filter: {}) => ({
    [filterKey]: {
      filter: {
        bool: {
          filter: filter,
        },
      },
      aggs,
    },
  })
  const termAggs = (key: string, field: string) => ({
    ...aggsFilter(
      key,
      {
        values: {
          terms: {
            field: field,
            size: 300,
          },
        },
      },
      postFilters
    ),
  })

  const supplierPostFilters = postFilters.filter((filter) => {
    const filterStr = JSON.stringify(filter)
    return !filterStr.includes('supplier.name')
  })

  const aggs = {
    ...aggsFilter(
      'iso',
      {
        values: {
          multi_terms: {
            terms: [{ field: 'isoCategory' }, { field: 'isoCategoryName' }],
            size: 100,
          },
        },
      },
      queryFilters
    ),
    ...aggsFilter(
      'suppliers',
      {
        values: {
          terms: {
            field: 'supplier.name',
            size: 300,
          },
        },
      },
      supplierPostFilters
    ),
    ...(filtersFromAdmin.includes('Setebredde') ? termAggs('setebreddeMinCM', 'filters.setebreddeMinCM') : []),
    ...(filtersFromAdmin.includes('Setebredde') ? termAggs('setebreddeMaksCM', 'filters.setebreddeMaksCM') : []),
    ...(filtersFromAdmin.includes('Setedybde') ? termAggs('setedybdeMinCM', 'filters.setedybdeMinCM') : []),
    ...(filtersFromAdmin.includes('Setedybde') ? termAggs('setedybdeMaksCM', 'filters.setedybdeMaksCM') : []),
    ...(filtersFromAdmin.includes('Setehøyde') ? termAggs('setehoydeMinCM', 'filters.setehoydeMinCM') : []),
    ...(filtersFromAdmin.includes('Setehøyde') ? termAggs('setehoydeMaksCM', 'filters.setehoydeMaksCM') : []),
  }

  const body: QueryObject = {
    from,
    size,
    track_scores: true,
    sort: sortOrderOpenSearch,
    query,
    aggs: { ...aggs },
    post_filter: {
      bool: {
        filter: postFilters,
      },
    },
    collapse: {
      field: 'seriesId',
    },
  }

  return await fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      return {
        products: mapProductsFromCollapse(data),
        iso: mapIsoAggregations(data),
        suppliers: mapSupplierAggregations(data),
        measurementFilters: mapMinMaxAggregations(data),
      }
    })
}

type IsoBucket = {
  key: string[]
  doc_count: number
}

type IsoAggregation = {
  doc_count: number
  values: {
    buckets: IsoBucket[]
  }
}

type SupplierBucket = {
  key: string
  doc_count: number
}

type SupplierAggregation = {
  doc_count: number
  values: {
    buckets: SupplierBucket[]
  }
}

type NewAggregation = {
  doc_count: number
  values: {
    buckets: { key: string; doc_count: number }[]
  }
}

type ProductIsoAggregationResponse = {
  hits: {
    total: object
    hits: Hit[]
  }
  aggregations: {
    iso: IsoAggregation
    suppliers: SupplierAggregation
    setebreddeMinCM: NewAggregation
    setebreddeMaksCM: NewAggregation
    setedybdeMinCM: NewAggregation
    setedybdeMaksCM: NewAggregation
    setehoydeMinCM: NewAggregation
    setehoydeMaksCM: NewAggregation
  }
}

const mapIsoAggregations = (data: ProductIsoAggregationResponse): IsoInfo[] => {
  return data.aggregations.iso.values.buckets.map((bucket) => ({ code: bucket.key[0], name: bucket.key[1] }))
}
const mapSupplierAggregations = (data: ProductIsoAggregationResponse): SupplierInfo[] => {
  return data.aggregations.suppliers.values.buckets.map((bucket) => ({ name: bucket.key }))
}

const mapMinMaxAggregations = (data: ProductIsoAggregationResponse): MeasurementInfo => {
  const { setebreddeMinCM, setebreddeMaksCM, setedybdeMinCM, setedybdeMaksCM, setehoydeMinCM, setehoydeMaksCM } =
    data.aggregations

  const ferdig = {}

  if (
    (setebreddeMinCM !== undefined && setebreddeMinCM.values.buckets.length > 0) ||
    (setebreddeMaksCM !== undefined && setebreddeMaksCM.values.buckets.length > 0)
  ) {
    Object.assign(ferdig, {
      ['Setebredde']: {
        key: 'Setebredde',
        value: data.aggregations.setebreddeMinCM.values.buckets.length ?? 0,
      },
    })
  }

  if (
    (setedybdeMinCM !== undefined && setedybdeMinCM.values.buckets.length > 0) ||
    (setedybdeMaksCM !== undefined && setedybdeMaksCM.values.buckets.length > 0)
  ) {
    Object.assign(ferdig, {
      ['Setedybde']: {
        key: 'Setedybde',
        value: data.aggregations.setedybdeMinCM.values.buckets.length ?? 0,
      },
    })
  }

  if (
    (setehoydeMinCM !== undefined && setehoydeMinCM.values.buckets.length > 0) ||
    (setehoydeMaksCM !== undefined && setehoydeMaksCM.values.buckets.length > 0)
  ) {
    Object.assign(ferdig, {
      ['Setehøyde']: {
        key: 'Setehoyde',
        value: data.aggregations.setehoydeMinCM.values.buckets.length ?? 0,
      },
    })
  }

  return ferdig
}
