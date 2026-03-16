import {
  filterLeverandor,
  filterMainProductsOnly,
  filterNotExpiredOnly,
  filterPrefixIsoKode,
} from '@/utils/filter-util'
import { mapProductsFromCollapse, Product } from '@/utils/product-util'
import { Hit } from '@/utils/response-types'
import { makeSearchTermQuery, QueryObject } from '@/utils/api-util'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'

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

export type TechDataFilterAgg = { filter: CategoryFilter; values: string[] }
export type TechDataFilterAggs = Map<string, TechDataFilterAgg>

export type ProductsWithIsoAggs = {
  products: Product[]
  iso: IsoInfo[]
  suppliers: SupplierInfo[]
  techDataFilterAggs: TechDataFilterAggs
}

export type CategoryFilter = {
  identifier: string //identifier
  fieldLabel: string
  searchParamName: string
  //filterDataType: FilterDataType
  filterComponentType: FilterComponentType
  //openSearchFields?: string | MinMaxFields
  openSearchFields2: OpenSearchField[]
  unit?: string
}

export type OpenSearchField = {
  filterDataType: FilterDataType
  openSearchFields: string | MinMaxFields
}

export interface MinMaxFields {
  min: string
  max: string
}

export enum FilterDataType {
  singleField,
  minMax,
}

export enum FilterComponentType {
  dropdown,
  range,
}

export const categoryFilters: CategoryFilter[] = [
  {
    identifier: 'Setebredde min/maks',
    fieldLabel: 'Setebredde',
    searchParamName: 'Setebredde',
    //filterDataType: FilterDataType.minMax,
    filterComponentType: FilterComponentType.range,
    //openSearchFields: { min: 'setebreddeMinCM', max: 'setebreddeMaksCM' },
    openSearchFields2: [
      {
        filterDataType: FilterDataType.minMax,
        openSearchFields: { min: 'setebreddeMinCM', max: 'setebreddeMaksCM' },
      },
    ],
    unit: 'cm',
  },
  {
    identifier: 'Setedybde min/maks',
    fieldLabel: 'Setedybde',
    searchParamName: 'Setedybde',
    //filterDataType: FilterDataType.minMax,
    filterComponentType: FilterComponentType.range,
    //openSearchFields: { min: 'setedybdeMinCM', max: 'setedybdeMaksCM' },
    openSearchFields2: [
      {
        filterDataType: FilterDataType.minMax,
        openSearchFields: { min: 'setedybdeMinCM', max: 'setedybdeMaksCM' },
      },
    ],
    unit: 'cm',
  },
  {
    identifier: 'Setehøyde min/maks',
    fieldLabel: 'Setehøyde',
    searchParamName: 'Setehoyde',
    //filterDataType: FilterDataType.minMax,
    filterComponentType: FilterComponentType.range,
    //openSearchFields: { min: 'setehoydeMinCM', max: 'setehoydeMaksCM' },
    openSearchFields2: [
      {
        filterDataType: FilterDataType.minMax,
        openSearchFields: { min: 'setehoydeMinCM', max: 'setehoydeMaksCM' },
      },
    ],
    unit: 'cm',
  },
  {
    identifier: 'Brukervekt maks',
    fieldLabel: 'Brukervekt maks',
    searchParamName: 'BrukervektMaks',
    //filterDataType: FilterDataType.singleField,
    filterComponentType: FilterComponentType.range,
    //openSearchFields: 'brukervektMaksKG',
    openSearchFields2: [
      {
        filterDataType: FilterDataType.singleField,
        openSearchFields: 'brukervektMaksKG',
      },
    ],
    unit: 'kg',
  },
  {
    identifier: 'Innendørs bruk',
    fieldLabel: 'Innendørs bruk',
    searchParamName: 'InnendorsBruk',
    //filterDataType: FilterDataType.singleField,
    filterComponentType: FilterComponentType.dropdown,
    //openSearchFields: 'innendorsBruk',
    openSearchFields2: [
      {
        filterDataType: FilterDataType.singleField,
        openSearchFields: 'innendorsBruk',
      },
    ],
  },
  {
    identifier: 'Utendørs bruk',
    fieldLabel: 'Utendørs bruk',
    searchParamName: 'UtendorsBruk',
    //filterDataType: FilterDataType.singleField,
    filterComponentType: FilterComponentType.dropdown,
    //openSearchFields: 'utendorsBruk',
    openSearchFields2: [
      {
        filterDataType: FilterDataType.singleField,
        openSearchFields: 'utendorsBruk',
      },
    ],
  },
  {
    identifier: 'Rammetype',
    fieldLabel: 'Rammetype',
    searchParamName: 'rammetype',
    //filterDataType: FilterDataType.singleField,
    filterComponentType: FilterComponentType.dropdown,
    //openSearchFields: 'rammetype',
    openSearchFields2: [
      {
        filterDataType: FilterDataType.singleField,
        openSearchFields: 'rammetype',
      },
    ],
  },
  {
    identifier: 'Totallengde',
    fieldLabel: 'Totallengde',
    searchParamName: 'Totallengde',
    //filterDataType: FilterDataType.singleField,
    filterComponentType: FilterComponentType.range,
    //openSearchFields: 'totallengdeCM',
    openSearchFields2: [
      {
        filterDataType: FilterDataType.singleField,
        openSearchFields: 'totallengdeCM',
      },
    ],
    unit: 'cm',
  },
  {
    identifier: 'Totalbredde',
    fieldLabel: 'Totalbredde',
    searchParamName: 'Totalbredde',
    //filterDataType: FilterDataType.singleField,
    filterComponentType: FilterComponentType.range,
    //openSearchFields: 'totalbreddeCM',
    openSearchFields2: [
      {
        filterDataType: FilterDataType.singleField,
        openSearchFields: 'totalbreddeCM',
      },
    ],
    unit: 'cm',
  },
  {
    identifier: 'Madrassbredde',
    fieldLabel: 'Madrassbredde',
    searchParamName: 'Madrassbredde',
    //filterDataType: FilterDataType.minMax,
    filterComponentType: FilterComponentType.range,
    //openSearchFields: { min: 'madrassbreddeMinCM', max: 'madrassbreddeMaksCM' },
    openSearchFields2: [
      {
        filterDataType: FilterDataType.minMax,
        openSearchFields: { min: 'madrassbreddeMinCM', max: 'madrassbreddeMaksCM' },
      },
      {
        filterDataType: FilterDataType.singleField,
        openSearchFields: 'madrassbreddeCM',
      },
    ],
    unit: 'cm',
  },
]

type FetchProps = {
  from: number
  size: number
  searchParams: ReadonlyURLSearchParams
  category: CategoryDTO
  dontCollapse?: boolean
}

export const fetchProductsKategori = async ({
  from,
  size,
  searchParams,
  category,
}: FetchProps): Promise<ProductsWithIsoAggs> => {
  const sortOrderOpenSearch = [{ 'agreements.rank': 'asc' }, { seriesId: 'desc' }]
  const searchTermQuery = makeSearchTermQuery({ searchTerm: '' })
  const visTilbDeler = false

  const categoryIsos = category.data.isos ?? []
  const filtersFromAdmin = category.data.filters ?? []

  const queryFilters: Array<any> = []
  const postFilters: Array<{ key: string; filter: any }> = []

  const techDataFilters = categoryFilters.filter((categoryFilter) =>
    filtersFromAdmin.includes(categoryFilter.identifier)
  )

  if (searchParams.has('iso')) {
    postFilters.push({ key: 'iso', filter: filterPrefixIsoKode(searchParams.getAll('iso')) })
  }

  if (searchParams.has('leverandor')) {
    postFilters.push({ key: 'leverandor', filter: filterLeverandor(searchParams.getAll('leverandor')) })
  }

  techDataFilters.forEach((filter) => {
    if (searchParams.has(filter.searchParamName)) {
      const equivalentFieldClauses: Array<any> = []
      filter.openSearchFields2.forEach((opensearchField) => {
        if (opensearchField.filterDataType === FilterDataType.minMax) {
          const searchValues = searchParams.get(filter.searchParamName)?.split(':') ?? ['', '']
          const searchFields = opensearchField.openSearchFields as MinMaxFields

          equivalentFieldClauses.push(
            filterMinMaxCategory(
              { key: searchFields.min, value: searchValues[0] },
              { key: searchFields.max, value: searchValues[1] }
            )
          )
        } else if (opensearchField.filterDataType === FilterDataType.singleField) {
          const searchField = opensearchField.openSearchFields as string
          if (filter.filterComponentType === FilterComponentType.range) {
            const searchValues = searchParams.get(filter.searchParamName)?.split(':') ?? ['', '']
            equivalentFieldClauses.push(filterSingleFieldRangeCategory(searchField, searchValues[0], searchValues[1]))
          } else {
            const searchValue = searchParams.getAll(filter.searchParamName)
            equivalentFieldClauses.push(filterSingleFieldCategory(searchField, searchValue))
          }
        }
      })
      if (equivalentFieldClauses.length === 1) {
        postFilters.push({ key: filter.identifier, filter: equivalentFieldClauses[0] })
      } else if (equivalentFieldClauses.length > 1) {
        return {
          bool: {
            should: [equivalentFieldClauses],
          },
        }
      }
    }
  })

  if (categoryIsos.length > 0) {
    queryFilters.push(filterPrefixIsoKode(categoryIsos))
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
  const techDataAggs = (filterName: string, key: string, field: string) => ({
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
      postFilters.filter(({ key }) => key !== filterName).map(({ filter }) => filter)
    ),
  })

  const techDataFilterAggs = Object.assign(
    {},
    ...techDataFilters
      .map((filter) => {
        filter.openSearchFields2
          .map((openSearchFieldConfig) => {
            if (openSearchFieldConfig.filterDataType === FilterDataType.minMax) {
              const searchFields = openSearchFieldConfig.openSearchFields as MinMaxFields
              return [
                techDataAggs(filter.identifier, searchFields.min, `filters.${searchFields.min}`),
                techDataAggs(filter.identifier, searchFields.max, `filters.${searchFields.max}`),
              ]
            } else if (openSearchFieldConfig.filterDataType === FilterDataType.singleField) {
              const searchField = openSearchFieldConfig.openSearchFields as string
              return [techDataAggs(filter.identifier, searchField, `filters.${searchField}`)]
            }
          })
          .flat()
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
      postFilters.filter(({ key }) => key !== 'leverandor').map(({ filter }) => filter)
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
        filter: postFilters.map(({ filter }) => filter),
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
        techDataFilterAggs: mapTechDataFilterAggregations(data, techDataFilters),
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

type TechDataAggregation = {
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
  } & {
    [key: string]: TechDataAggregation
  }
}

const mapIsoAggregations = (data: ProductIsoAggregationResponse): IsoInfo[] => {
  return data.aggregations.iso.values.buckets.map((bucket) => ({ code: bucket.key[0], name: bucket.key[1] }))
}
const mapSupplierAggregations = (data: ProductIsoAggregationResponse): SupplierInfo[] => {
  return data.aggregations.suppliers.values.buckets.map((bucket) => ({ name: bucket.key }))
}

const mapTechDataFilterAggregations = (
  data: ProductIsoAggregationResponse,
  techDataFilters: CategoryFilter[]
): TechDataFilterAggs => {
  const map = new Map<string, { filter: CategoryFilter; values: string[] }>()

  const aggMap = new Map(Object.entries(data.aggregations))

  techDataFilters.forEach((filter) => {
    map.set(filter.identifier, {
      filter: filter,
      values: filter.openSearchFields2
        .map((openSearchFieldConfig) => {
          if (openSearchFieldConfig.filterDataType === FilterDataType.minMax) {
            const searchFields = openSearchFieldConfig.openSearchFields as MinMaxFields

            const minValues = aggMap.get(searchFields.min)?.values.buckets.map((bucket) => bucket.key.toString())
            const maxValues = aggMap.get(searchFields.max)?.values.buckets.map((bucket) => bucket.key.toString())

            if (!!minValues || !!maxValues) {
              return [...minValues!, ...maxValues!]
            }
          } else if (openSearchFieldConfig.filterDataType === FilterDataType.singleField) {
            const searchField = openSearchFieldConfig.openSearchFields as string
            const values = aggMap.get(searchField)?.values.buckets.map((bucket) => bucket.key.toString())

            if (!!values) {
              map.set(filter.identifier, { filter: filter, values: values })
            }
          }
          return []
        })
        .flat(),
    })
  })

  return map
}

const filterSingleFieldCategory = (key: string, values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({ term: { [`filters.${key}`]: value } })),
  },
})

const filterSingleFieldRangeCategory = (key: string, valueFrom: string, valueTo: string) => {
  const clauses: any[] = []
  if (valueFrom !== '') {
    clauses.push({
      range: {
        [`filters.${key}`]: {
          gte: Number(valueFrom),
        },
      },
    })
  }
  if (valueTo !== '') {
    clauses.push({
      range: {
        [`filters.${key}`]: {
          lte: Number(valueTo),
        },
      },
    })
  }

  return {
    bool: {
      must: clauses,
    },
  }
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
