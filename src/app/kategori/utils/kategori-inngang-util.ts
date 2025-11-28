import { filterLeverandor, filterMainProductsOnly, filterMinMax, filterPrefixIsoKode } from '@/utils/filter-util'
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

export type ProductsWithIsoAggs = {
  products: Product[]
  iso: IsoInfo[]
  suppliers: SupplierInfo[]
  minMaxFilters?: MinMaxInfo[]
}

export type SearchFiltersKategori = {
  suppliers: string[]
  isos: string[]
  setebreddeMaksCM?: string
  setebreddeMinCM?: string
  setedybdeMaksCM?: string
  setehoydeMaksCM?: string
  setehoydeMinCM?: string
  setedybdeMinCM?: string
}

export type SearchDataKategori = {
  isoCode?: string
  sortOrder?: SortOrder
  filters?: SearchFiltersKategori
}

type FetchProps = {
  from: number
  size: number
  searchData: SearchDataKategori
  kategoriIsos: string[]
  dontCollapse?: boolean
}

export const fetchProductsKategori2 = async ({
  from,
  size,
  searchData,
  kategoriIsos,
}: FetchProps): Promise<ProductsWithIsoAggs> => {
  const { sortOrder, filters } = searchData
  const sortOrderOpenSearch = sortOrder ? sortOptionsOpenSearch[sortOrder] : sortOptionsOpenSearch['Rangering']
  const searchTermQuery = makeSearchTermQuery({ searchTerm: '' })
  const visTilbDeler = false

  const queryFilters: Array<any> = []
  const postFilters: Array<any> = []

  if (filters && filters.isos) {
    postFilters.push(filterPrefixIsoKode(filters.isos))
  }

  if (filters && filters.suppliers) {
    postFilters.push(filterLeverandor(filters.suppliers))
  }

  if (filters && filters.setebreddeMinCM && filters.setebreddeMaksCM) {
    postFilters.push(
      filterMinMax({ setebreddeMinCM: filters.setebreddeMinCM }, { setebreddeMaksCM: filters.setebreddeMaksCM })
    )
  }
  if (filters && filters.setedybdeMinCM && filters.setedybdeMaksCM) {
    postFilters.push(
      filterMinMax({ setedybdeMinCM: filters.setedybdeMinCM }, { setedybdeMaksCM: filters.setedybdeMaksCM })
    )
  }
  if (filters && filters.setehoydeMinCM && filters.setehoydeMaksCM) {
    postFilters.push(
      filterMinMax({ setehoydeMinCM: filters.setehoydeMinCM }, { setehoydeMaksCM: filters.setehoydeMaksCM })
    )
  }

  if (kategoriIsos.length > 0) {
    queryFilters.push(filterPrefixIsoKode(kategoriIsos))
  }

  if (!visTilbDeler) {
    queryFilters.push(filterMainProductsOnly())
  }

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
          terms: { field: 'supplier.name', size: 300 },
        },
      },
      postFilters
    ),
    ...aggsFilter(
      'setebreddeMinCM',
      {
        min: {
          min: {
            field: 'filters.setebreddeMinCM',
          },
        },
      },
      postFilters
    ),
    ...aggsFilter(
      'setebreddeMaksCM',
      {
        max: {
          max: {
            field: 'filters.setebreddeMaksCM',
          },
        },
      },
      postFilters
    ),
    ...aggsFilter(
      'setedybdeMinCM',
      {
        min: {
          min: {
            field: 'filters.setedybdeMinCM',
          },
        },
      },
      postFilters
    ),
    ...aggsFilter(
      'setedybdeMaksCM',
      {
        max: {
          max: {
            field: 'filters.setedybdeMaksCM',
          },
        },
      },
      postFilters
    ),
    ...aggsFilter(
      'setehoydeMinCM',
      {
        min: {
          min: {
            field: 'filters.setehoydeMinCM',
          },
        },
      },
      postFilters
    ),
    ...aggsFilter(
      'setehoydeMaksCM',
      {
        max: {
          max: {
            field: 'filters.setehoydeMaksCM',
          },
        },
      },
      postFilters
    ),
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
        minMaxFilters: mapMinMaxAggregations(data),
      }
    })
}

export const fetchProductsKategori = async ({ from, size, searchData }: FetchProps): Promise<ProductsWithIsoAggs> => {
  const { isoCode, sortOrder, filters } = searchData
  const sortOrderOpenSearch = sortOrder ? sortOptionsOpenSearch[sortOrder] : sortOptionsOpenSearch['Rangering']
  const searchTermQuery = makeSearchTermQuery({ searchTerm: '' })
  const visTilbDeler = false

  const queryFilters: Array<any> = []
  const postFilters: Array<any> = []

  if (filters && filters.isos) {
    postFilters.push(filterPrefixIsoKode(filters.isos))
  }

  if (filters && filters.suppliers) {
    postFilters.push(filterLeverandor(filters.suppliers))
  }

  if (isoCode) {
    queryFilters.push({
      match_bool_prefix: {
        isoCategory: isoCode,
      },
    })
  }

  if (!visTilbDeler) {
    queryFilters.push(filterMainProductsOnly())
  }

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
          terms: { field: 'supplier.name', size: 300 },
        },
      },
      postFilters
    ),
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
      console.log(data)
      return {
        products: mapProductsFromCollapse(data),
        iso: mapIsoAggregations(data),
        suppliers: mapSupplierAggregations(data),
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

type MinAggregation = {
  min: {
    value: {
      parsedValue?: number
    } | null
  }
}
type MaxAggregation = {
  max: {
    value: {
      parsedValue?: number
    } | null
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
    setebreddeMinCM: MinAggregation
    setebreddeMaksCM: MaxAggregation
    setedybdeMinCM: MinAggregation
    setedybdeMaksCM: MaxAggregation
    setehoydeMinCM: MinAggregation
    setehoydeMaksCM: MaxAggregation
  }
}

const mapIsoAggregations = (data: ProductIsoAggregationResponse): IsoInfo[] => {
  return data.aggregations.iso.values.buckets.map((bucket) => ({ code: bucket.key[0], name: bucket.key[1] }))
}
const mapSupplierAggregations = (data: ProductIsoAggregationResponse): SupplierInfo[] => {
  return data.aggregations.suppliers.values.buckets.map((bucket) => ({ name: bucket.key }))
}

export type MinMaxInfo = {
  name: string
  type: 'min' | 'max'
  value: number
}

const mapMinMaxAggregations = (data: ProductIsoAggregationResponse): MinMaxInfo[] => {
  let minMaxInfo: Array<MinMaxInfo> = []
  minMaxInfo.push({
    name: 'setebreddeMinCM',
    type: 'min',
    value: data.aggregations.setebreddeMinCM.min.value?.parsedValue ?? 0,
  })
  minMaxInfo.push({
    name: 'setebreddeMaksCM',
    type: 'max',
    value: data.aggregations.setebreddeMaksCM.max.value?.parsedValue ?? 0,
  })
  minMaxInfo.push({
    name: 'setedybdeMinCM',
    type: 'min',
    value: data.aggregations.setedybdeMinCM.min.value?.parsedValue ?? 0,
  })
  minMaxInfo.push({
    name: 'setedybdeMaksCM',
    type: 'max',
    value: data.aggregations.setedybdeMaksCM.max.value?.parsedValue ?? 0,
  })
  minMaxInfo.push({
    name: 'setehoydeMinCM',
    type: 'min',
    value: data.aggregations.setehoydeMinCM.min.value?.parsedValue ?? 0,
  })
  minMaxInfo.push({
    name: 'setehoydeMaksCM',
    type: 'max',
    value: data.aggregations.setehoydeMaksCM.max.value?.parsedValue ?? 0,
  })
  return minMaxInfo
}
