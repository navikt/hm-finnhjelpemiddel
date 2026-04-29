import {
  filterLeverandor,
  filterMainProductsOnly,
  filterNotExpiredOnly,
  filterPrefixIsoKode,
} from '@/utils/filter-util'
import { mapProductWithVariants, Product } from '@/utils/product-util'
import { makeSearchTermQuery, QueryObject, sortOptionsOpenSearch } from '@/utils/api-util'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'
import { ProductIsoAggregationResponse, SingleValueAggregation } from '@/app/kategori/utils/category-response-types'
import {
  CategoryFilter,
  FilterFunctionType,
  IsoInfo,
  MinMaxFields,
  ProductsWithIsoAggs,
  SupplierInfo,
  TechDataFilterAggs,
} from '@/app/kategori/utils/category-types'
import { categoryFilters } from '@/app/kategori/utils/category-filter-utils'
import { Hit, ProductSourceResponse } from '@/utils/response-types'

//if HM_SEARCH_URL is undefined it means that we are on the client and we want to use relative url
const HM_SEARCH_URL = process.env.HM_SEARCH_URL || ''
export const PAGE_SIZE = 24

type FetchProps = {
  from: number
  size: number
  searchParams: ReadonlyURLSearchParams
  category: CategoryDTO
  onAgreement: boolean
}

export const fetchProductsCategory = async ({
  from,
  size,
  searchParams,
  category,
  onAgreement,
}: FetchProps): Promise<ProductsWithIsoAggs> => {
  const sortOrderOpenSearch = sortOptionsOpenSearch['Rangering']
  const searchTermQuery = makeSearchTermQuery({ searchTerm: '' })
  const showAccessoriesParts = false

  const categoryIsos = category.data.isos ?? []
  const filtersFromAdmin = category.data.filters ?? []

  const queryFilters: Array<any> = []
  const postFilters: Array<{ key: string; filter: any }> = []

  const techDataFilters = categoryFilters.filter((categoryFilter) =>
    filtersFromAdmin.includes(categoryFilter.identifier)
  )

  postFilters.push({
    key: 'agreement',
    filter: {
      bool: {
        should: { term: { hasAgreement: onAgreement } },
      },
    },
  })

  if (searchParams.has('iso')) {
    postFilters.push({ key: 'iso', filter: filterPrefixIsoKode(searchParams.getAll('iso')) })
  }

  if (searchParams.has('leverandor')) {
    postFilters.push({ key: 'leverandor', filter: filterLeverandor(searchParams.getAll('leverandor')) })
  }

  if (searchParams.has('På digital behovsmelding')) {
    postFilters.push({
      key: 'digitalSoknad',
      filter: {
        bool: {
          should: { term: { 'attributes.digitalSoknad': searchParams.get('På digital behovsmelding') } },
        },
      },
    })
  }

  if (searchParams.has('På bestillingsordning')) {
    postFilters.push({
      key: 'bestillingsordning',
      filter: {
        bool: {
          should: { term: { 'attributes.bestillingsordning': searchParams.get('På bestillingsordning') } },
        },
      },
    })
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

  if (!showAccessoriesParts) {
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
      postFilters.filter(({ key }) => key !== 'iso').map(({ filter }) => filter)
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
    ...aggsFilter(
      'digitalSoknad',
      {
        values: {
          terms: {
            field: 'attributes.digitalSoknad',
            size: 10,
          },
        },
      },
      postFilters.filter(({ key }) => key !== 'digitalSoknad').map(({ filter }) => filter)
    ),
    ...aggsFilter(
      'bestillingsordning',
      {
        values: {
          terms: {
            field: 'attributes.bestillingsordning',
            size: 10,
          },
        },
      },
      postFilters.filter(({ key }) => key !== 'bestillingsordning').map(({ filter }) => filter)
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
    .then((data: ProductIsoAggregationResponse) => {
      return {
        products: mapProducts(data),
        iso: mapIsoAggregations(data),
        suppliers: mapSupplierAggregations(data),
        techDataFilterAggs: mapTechDataFilterAggregations(data, techDataFilters),
        digitalSoknad: mapBooleanAggregations(data.aggregations.digitalSoknad),
        bestillingsordning: mapBooleanAggregations(data.aggregations.bestillingsordning),
      }
    })
}

const mapProducts = (data: ProductIsoAggregationResponse): Product[] => {
  return data.hits.hits.map((hit: Hit) => mapProductWithVariants(Array(hit._source as ProductSourceResponse)))
}

const mapIsoAggregations = (data: ProductIsoAggregationResponse): IsoInfo[] => {
  return data.aggregations.iso.values.buckets.map((bucket) => ({ code: bucket.key[0], name: bucket.key[1] }))
}
const mapSupplierAggregations = (data: ProductIsoAggregationResponse): SupplierInfo[] => {
  return data.aggregations.suppliers.values.buckets.map((bucket) => ({ name: bucket.key }))
}

const mapBooleanAggregations = (agg: SingleValueAggregation): boolean[] => {
  return agg.values.buckets.map((bucket) => !!bucket.key)
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
