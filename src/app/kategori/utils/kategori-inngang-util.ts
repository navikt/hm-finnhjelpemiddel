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
  filterFunctionType: FilterFunctionType
  openSearchFieldGroups: (string | MinMaxFields)[]
  unit?: string
}

export interface MinMaxFields {
  fromField: string
  toField: string
}

export enum FilterTechDataType {
  singleField,
  minMax,
}

export enum FilterFunctionType {
  singleField,
  range,
}

export const categoryFilters: CategoryFilter[] = [
  {
    identifier: 'Setebredde min/maks',
    fieldLabel: 'Setebredde',
    searchParamName: 'Setebredde',
    filterFunctionType: FilterFunctionType.range,
    openSearchFieldGroups: [{ fromField: 'setebreddeMinCM', toField: 'setebreddeMaksCM' }],
    unit: 'cm',
  },
  {
    identifier: 'Setedybde min/maks',
    fieldLabel: 'Setedybde',
    searchParamName: 'Setedybde',
    filterFunctionType: FilterFunctionType.range,
    openSearchFieldGroups: [{ fromField: 'setedybdeMinCM', toField: 'setedybdeMaksCM' }],
    unit: 'cm',
  },
  {
    identifier: 'Setehøyde min/maks',
    fieldLabel: 'Setehøyde',
    searchParamName: 'Setehoyde',
    filterFunctionType: FilterFunctionType.range,
    openSearchFieldGroups: [{ fromField: 'setehoydeMinCM', toField: 'setehoydeMaksCM' }],
    unit: 'cm',
  },
  {
    identifier: 'Brukervekt maks',
    fieldLabel: 'Brukervekt maks',
    searchParamName: 'BrukervektMaks',
    filterFunctionType: FilterFunctionType.range,
    openSearchFieldGroups: [{ fromField: 'brukervektMaksKG', toField: 'brukervektMaksKG' }],
    unit: 'kg',
  },
  {
    identifier: 'Innendørs bruk',
    fieldLabel: 'Innendørs bruk',
    searchParamName: 'InnendorsBruk',
    filterFunctionType: FilterFunctionType.singleField,
    openSearchFieldGroups: ['innendorsBruk'],
  },
  {
    identifier: 'Utendørs bruk',
    fieldLabel: 'Utendørs bruk',
    searchParamName: 'UtendorsBruk',
    filterFunctionType: FilterFunctionType.singleField,
    openSearchFieldGroups: ['utendorsBruk'],
  },
  {
    identifier: 'Rammetype',
    fieldLabel: 'Rammetype',
    searchParamName: 'rammetype',
    filterFunctionType: FilterFunctionType.singleField,
    openSearchFieldGroups: ['rammetype'],
  },
  {
    identifier: 'Totallengde',
    fieldLabel: 'Totallengde',
    searchParamName: 'Totallengde',
    filterFunctionType: FilterFunctionType.range,
    openSearchFieldGroups: [{ fromField: 'totallengdeCM', toField: 'totallengdeCM' }],
    unit: 'cm',
  },
  {
    identifier: 'Totalbredde',
    fieldLabel: 'Totalbredde',
    searchParamName: 'Totalbredde',
    filterFunctionType: FilterFunctionType.range,
    openSearchFieldGroups: [{ fromField: 'totalbreddeCM', toField: 'totalbreddeCM' }],
    unit: 'cm',
  },
  {
    identifier: 'Madrassbredde',
    fieldLabel: 'Madrassbredde',
    searchParamName: 'Madrassbredde',
    filterFunctionType: FilterFunctionType.range,
    openSearchFieldGroups: [
      { fromField: 'madrassbreddeMinCM', toField: 'madrassbreddeMaksCM' },
      { fromField: 'madrassbreddeCM', toField: 'madrassbreddeCM' },
    ],
    unit: 'cm',
  },
  {
    identifier: 'Madrasslengde',
    fieldLabel: 'Madrasslengde',
    searchParamName: 'Madrasslengde',
    filterFunctionType: FilterFunctionType.range,
    openSearchFieldGroups: [
      { fromField: 'madrasslengdeMinCM', toField: 'madrasslengdeMaksCM' },
      { fromField: 'madrasslengdeCM', toField: 'madrasslengdeCM' },
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
      const filterGroupClauses = filter.openSearchFieldGroups.map((opensearchFieldGroup) => {
        const searchValues = searchParams.getAll(filter.searchParamName)

        return {
          bool: {
            should: searchValues.map((searchValue) => {
              if (filter.filterFunctionType === FilterFunctionType.range) {
                const [fromSearchField, toSearchField] = searchValue.split(':')
                const openSearchFields = opensearchFieldGroup as MinMaxFields
                return rangeClause(fromSearchField, toSearchField, openSearchFields.fromField, openSearchFields.toField)
              } else {
                const openSearchField = opensearchFieldGroup as string
                return { term: { [`filters.${openSearchField}`]: searchValue } }
              }
            }),
          },
        }
      })

      postFilters.push({
        key: filter.identifier,
        filter: {
          bool: {
            should: filterGroupClauses,
          },
        },
      })
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
        return filter.openSearchFieldGroups.map((openSearchFieldGroup) => {
          if (filter.filterFunctionType === FilterFunctionType.range) {
            const searchFields = openSearchFieldGroup as MinMaxFields

            if (searchFields.fromField === searchFields.toField) {
              return [techDataAggs(filter.identifier, searchFields.fromField, `filters.${searchFields.fromField}`)]
            } else {
              return [
                techDataAggs(filter.identifier, searchFields.fromField, `filters.${searchFields.fromField}`),
                techDataAggs(filter.identifier, searchFields.toField, `filters.${searchFields.toField}`),
              ]
            }
          } else if (filter.filterFunctionType === FilterFunctionType.singleField) {
            const searchField = openSearchFieldGroup as string
            return [techDataAggs(filter.identifier, searchField, `filters.${searchField}`)]
          }
        })
      })
      .flat(2)
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
    const values = filter.openSearchFieldGroups
      .map((openSearchFieldGroup) => {
        if (filter.filterFunctionType === FilterFunctionType.range) {
          const searchFields = openSearchFieldGroup as MinMaxFields

          const minValues = aggMap.get(searchFields.fromField)?.values.buckets.length ?? 0
          const maxValues = aggMap.get(searchFields.toField)?.values.buckets.length ?? 0

          if (minValues > 1 || maxValues > 1) {
            return ['en', 'to']
          }
        } else if (filter.filterFunctionType === FilterFunctionType.singleField) {
          const searchField = openSearchFieldGroup as string
          const values = aggMap.get(searchField)?.values.buckets.map((bucket) => bucket.key.toString())

          if (!!values) {
            return values
          }
        }
        return []
      })
      .flat()

    map.set(filter.identifier, {
      filter: filter,
      values: values,
    })
  })

  return map
}

const lessThanClause = (key: string, value: string) => {
  return {
    range: {
      [`filters.${key}`]: {
        lte: Number(value),
      },
    },
  }
}

const moreThanClause = (key: string, value: string) => {
  return {
    range: {
      [`filters.${key}`]: {
        gte: Number(value),
      },
    },
  }
}

const rangeClause = (fromValue: string, toValue: string, openSearchFieldFrom: string, openSearchFieldTo: string) => {
  const rangeClauses = []

  if (fromValue != '') {
    rangeClauses.push(moreThanClause(openSearchFieldTo, fromValue))
  }

  if (toValue != '') {
    rangeClauses.push(lessThanClause(openSearchFieldFrom, toValue))
  }

  return {
    bool: {
      must: rangeClauses,
    },
  }
}
