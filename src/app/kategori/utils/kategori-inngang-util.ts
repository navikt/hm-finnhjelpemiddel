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

  if (filters && filters.Setebredde) {
    postFilters.push(filterMinMax({ setebreddeMinCM: filters.Setebredde }, { setebreddeMaksCM: filters.Setebredde }))
  }
  if (filters && filters.Setedybde && filters.Setedybde) {
    postFilters.push(filterMinMax({ setedybdeMinCM: filters.Setedybde }, { setedybdeMaksCM: filters.Setedybde }))
  }
  if (filters && filters.Setehoyde && filters.Setehoyde) {
    postFilters.push(filterMinMax({ setehoydeMinCM: filters.Setehoyde }, { setehoydeMaksCM: filters.Setehoyde }))
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
    ...termAggs('suppliers', 'supplier.name'),
    ...termAggs('setebreddeMinCM', 'filters.setebreddeMinCM'),
    ...termAggs('setebreddeMaksCM', 'filters.setebreddeMaksCM'),
    ...termAggs('setedybdeMinCM', 'filters.setedybdeMinCM'),
    ...termAggs('setedybdeMaksCM', 'filters.setedybdeMaksCM'),
    ...termAggs('setehoydeMinCM', 'filters.setehoydeMinCM'),
    ...termAggs('setehoydeMaksCM', 'filters.setehoydeMaksCM'),
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

  let ferdig = {}

  if (setebreddeMinCM.values.buckets.length > 0 || setebreddeMaksCM.values.buckets.length > 0) {
    Object.assign(ferdig, {
      ['Setebredde']: {
        key: 'Setebredde',
        value: data.aggregations.setebreddeMinCM.values.buckets.length ?? 0,
      },
    })
  }

  if (setedybdeMinCM.values.buckets.length > 0 || setedybdeMaksCM.values.buckets.length > 0) {
    Object.assign(ferdig, {
      ['Setedybde']: {
        key: 'Setedybde',
        value: data.aggregations.setedybdeMinCM.values.buckets.length ?? 0,
      },
    })
  }

  if (setehoydeMinCM.values.buckets.length > 0 || setehoydeMaksCM.values.buckets.length > 0) {
    Object.assign(ferdig, {
      ['Setehøyde']: {
        key: 'Setehoyde',
        value: data.aggregations.setehoydeMinCM.values.buckets.length ?? 0,
      },
    })
  }

  return ferdig
}
