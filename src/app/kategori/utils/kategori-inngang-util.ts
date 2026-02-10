import {
  filterLeverandor,
  filterMainProductsOnly,
  filterNotExpiredOnly,
  filterPrefixIsoKode,
} from '@/utils/filter-util'
import { isValidSortOrder } from '@/utils/search-state-util'
import { mapProductsFromCollapse, Product } from '@/utils/product-util'
import { Hit } from '@/utils/response-types'
import { makeSearchTermQuery, QueryObject, sortOptionsOpenSearch } from '@/utils/api-util'
import { ReadonlyURLSearchParams } from 'next/navigation'

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
  measurementFilters2: Map<string, string[]>
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
  searchParamName: string
  filterDataType: FilterDataType
  searchFields: string | MinMaxFields
}

export interface MinMaxFields {
  min: string
  max: string
}

export enum FilterDataType {
  singleField,
  minMax,
}

export const categoryFilters: CategoryFilter[] = [
  {
    fieldName: 'Setebredde',
    searchParamName: 'Setebredde',
    filterDataType: FilterDataType.minMax,
    searchFields: { min: 'setebreddeMinCM', max: 'setebreddeMaksCM' },
  },
  {
    fieldName: 'Setedybde',
    searchParamName: 'Setedybde',
    filterDataType: FilterDataType.minMax,
    searchFields: { min: 'setedybdeMinCM', max: 'setedybdeMaksCM' },
  },
  {
    fieldName: 'Setehøyde',
    searchParamName: 'Setehoyde',
    filterDataType: FilterDataType.minMax,
    searchFields: { min: 'setehoydeMinCM', max: 'setehoydeMaksCM' },
  },
]

type FetchProps = {
  from: number
  size: number
  searchParams: ReadonlyURLSearchParams
  kategoriIsos: string[]
  dontCollapse?: boolean
}

export const fetchProductsKategori = async ({
  from,
  size,
  searchParams,
  kategoriIsos,
}: FetchProps): Promise<ProductsWithIsoAggs> => {
  const sortOrderStr = searchParams.get('sortering') || ''
  const sortOrder = isValidSortOrder(sortOrderStr) ? sortOrderStr : 'Rangering'
  const sortOrderOpenSearch = sortOrder ? sortOptionsOpenSearch[sortOrder] : sortOptionsOpenSearch['Rangering']
  const searchTermQuery = makeSearchTermQuery({ searchTerm: '' })
  const visTilbDeler = false

  const queryFilters: Array<any> = []
  const postFilters: Array<any> = []

  const filtersFromAdmin = ['Setebredde', 'Setedybde', 'Setehøyde']

  const techDataFilters = categoryFilters.filter((categoryFilter) =>
    filtersFromAdmin.includes(categoryFilter.fieldName)
  )

  if (searchParams.has('iso')) {
    postFilters.push(filterPrefixIsoKode(searchParams.getAll('iso')))
  }

  if (searchParams.has('leverandor')) {
    postFilters.push(filterLeverandor(searchParams.getAll('leverandor')))
  }

  techDataFilters.forEach((filter) => {
    if (searchParams.has(filter.searchParamName)) {
      const searchValue = searchParams.get(filter.searchParamName) ?? ''

      if (filter.filterDataType === FilterDataType.minMax) {
        const searchFields = filter.searchFields as MinMaxFields

        postFilters.push(
          filterMinMaxCategory(
            { key: searchFields.min, value: searchValue },
            { key: searchFields.max, value: searchValue }
          )
        )
      }
    }
  })

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

  const techDataFilterAggs = Object.assign(
    {},
    ...techDataFilters
      .map((filter) => {
        if (filter.filterDataType === FilterDataType.minMax) {
          const searchFields = filter.searchFields as MinMaxFields
          return [
            termAggs(searchFields.min, `filters.${searchFields.min}`),
            termAggs(searchFields.max, `filters.${searchFields.max}`),
          ]
        }
      })
      .flat()
  )

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
    ...techDataFilterAggs,
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
        measurementFilters2: mapTechDataFilterAggregations(data, techDataFilters),
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
  } & {
    [key: string]: NewAggregation
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

const mapTechDataFilterAggregations = (
  data: ProductIsoAggregationResponse,
  perCategoryFilters: CategoryFilter[]
): Map<string, string[]> => {
  const map = new Map<string, string[]>()

  const aggMap = new Map(Object.entries(data.aggregations))

  perCategoryFilters.forEach((filter) => {
    if (filter.filterDataType === FilterDataType.minMax) {
      const searchFields = filter.searchFields as MinMaxFields

      const minValues = aggMap.get(searchFields.min)?.values.buckets.map((bucket) => bucket.key.toString())
      const maxValues = aggMap.get(searchFields.max)?.values.buckets.map((bucket) => bucket.key.toString())

      if (!!minValues || !!maxValues) {
        map.set(filter.fieldName, [...minValues!, ...maxValues!])
      }
    }
  })

  return map
}

const filterMinMaxCategory = (min: { key: string; value: string }, max: { key: string; value: string }) => {
  const keyMin = min.key
  const valueMin = min.value
  const keyMax = max.key
  const valueMax = max.value

  if (!valueMin?.length && !valueMax?.length) return null

  const mustClausesMin: any[] = []
  const mustClausesMax: any[] = []
  if (valueMin !== '') {
    mustClausesMax.push({
      range: {
        [`filters.${keyMax}`]: {
          gte: Number(valueMin),
        },
      },
    })
  }

  if (valueMax !== '') {
    mustClausesMin.push({
      range: {
        [`filters.${keyMin}`]: {
          lte: Number(valueMax),
        },
      },
    })
  }

  return {
    bool: {
      must: mustClausesMax.concat(mustClausesMin),
    },
  }
}
