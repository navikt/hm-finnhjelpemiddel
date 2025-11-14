import { filterLeverandor, filterMainProductsOnly, filterPrefixIsoKode } from '@/utils/filter-util'
import { SortOrder } from '@/utils/search-state-util'
import { mapProductsFromCollapse, Product } from '@/utils/product-util'
import { Hit } from '@/utils/response-types'
import { QueryObject, sortOptionsOpenSearch } from '@/utils/api-util'

//if HM_SEARCH_URL is undefined it means that we are on the client and we want to use relative url
const HM_SEARCH_URL = process.env.HM_SEARCH_URL || ''
export const PAGE_SIZE = 24

const makeSearchTermQueryKategori = ({ seriesId }: { seriesId?: string }) => {
  const commonBoosting = {
    negative: {
      bool: {
        must: {
          bool: {},
        },
      },
    },
    //Ganges med 1 betyr samme boost. Ganges med et mindre tall betyr lavere boost og kommer lenger ned. Om den settes til 0 forsvinner den helt fordi alt som ganges med 0 er 0
    negative_boost: 1,
  }

  const negativeBoostInactiveProducts = {
    negative: {
      match: {
        status: 'INACTIVE',
      },
    },
    //Ganges med 1 betyr samme boost. Ganges med et mindre tall betyr lavere boost og kommer lenger ned. Om den settes til 0 forsvinner den helt fordi alt som ganges med 0 er 0
    negative_boost: 0.4,
  }

  const negativeBoostNonAgreementProducts = {
    negative: {
      match: {
        hasAgreement: false,
      },
    },
    //Ganges med 1 betyr samme boost. Ganges med et mindre tall betyr lavere boost og kommer lenger ned. Om den settes til 0 forsvinner den helt fordi alt som ganges med 0 er 0
    negative_boost: 0.1,
  }

  const bool = {
    should: [
      {
        boosting: {
          positive: {
            multi_match: {
              query: '',
              type: 'cross_fields',
              fields: [
                'isoCategoryTitle^2',
                'isoCategoryText^0.5',
                'title^0.5',
                'attributes.text^0.1',
                'keywords_bag^0.1',
              ],
              operator: 'and',
              zero_terms_query: 'all',
            },
          },
          ...commonBoosting,
          ...negativeBoostInactiveProducts,
          ...negativeBoostNonAgreementProducts,
        },
      },
    ],
  }

  const termSeriesId = {
    seriesId: seriesId,
  }

  const mustAlternatives = () => {
    let must: any[] = [{ bool: bool }]

    if (seriesId !== undefined) {
      must = must.concat([{ term: termSeriesId }])
    }

    return must
  }

  return {
    must: mustAlternatives(),
  }
}

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
}

export type SearchFiltersKategori = {
  suppliers: string[]
  isos: string[]
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
  dontCollapse?: boolean
  seriesId?: string
}

export const fetchProductsKategori = async ({
  from,
  size,
  searchData,
  seriesId,
}: FetchProps): Promise<ProductsWithIsoAggs> => {
  const { isoCode, sortOrder, filters } = searchData
  const sortOrderOpenSearch = sortOrder ? sortOptionsOpenSearch[sortOrder] : sortOptionsOpenSearch['Rangering']
  const searchTermQuery = makeSearchTermQueryKategori({ seriesId })
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

type ProductIsoAggregationResponse = {
  hits: {
    total: object
    hits: Hit[]
  }
  aggregations: {
    iso: IsoAggregation
    suppliers: SupplierAggregation
  }
}

const mapIsoAggregations = (data: ProductIsoAggregationResponse): IsoInfo[] => {
  return data.aggregations.iso.values.buckets.map((bucket) => ({ code: bucket.key[0], name: bucket.key[1] }))
}
const mapSupplierAggregations = (data: ProductIsoAggregationResponse): SupplierInfo[] => {
  return data.aggregations.suppliers.values.buckets.map((bucket) => ({ name: bucket.key }))
}
