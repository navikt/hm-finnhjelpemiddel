import { mapAllNews, News } from '@/utils/news-util'
import { formatNorwegianLetter } from '@/utils/string-util'
import { mapSuppliers, Supplier } from '@/utils/supplier-util'
import { AgreementLabel, mapAgreementLabels } from './agreement-util'
import {
  filterBeregnetBarn,
  filterBredde,
  filterDelkontrakt,
  filterFyllmateriale,
  filterLengde,
  filterLeverandor,
  filterMaterialeTrekk,
  filterMinMax,
  filterProduktkategori,
  filterRammeavtale,
  filterStatus,
  filterTotalvekt,
  filterVis,
  toMinMaxAggs,
} from './filter-util'
import {
  HMSSuggestionWheelChair,
  mapHMSSuggestionFromSearchResponse,
  mapProductFromSeriesId,
  mapProductsFromAggregation,
  mapProductsFromCollapse,
  mapProductVariant,
  Product,
  ProductVariant,
  wheelchairFilters,
} from './product-util'
import { AgreementDocResponse, AgreementSearchResponse, PostBucketResponse, SearchResponse } from './response-types'
import { SearchData } from './search-state-util'
import { Fetcher } from "swr";

export const PAGE_SIZE = 24

//if HM_SEARCH_URL is undefined it means that we are on the client and we want to use relative url
const HM_SEARCH_URL = process.env.HM_SEARCH_URL || ''

export type Bucket = {
  key: number | string
  doc_count: number
  label?: string
}

export type FilterCategoryKeyServer =
  | 'lengdeCM'
  | 'breddeCM'
  | 'brukervektMinKG'
  | 'brukervektMaksKG'
  | 'totalVektKG'
  | 'fyllmateriale'
  | 'materialeTrekk'
  | 'beregnetBarn'
  | 'leverandor'
  | 'produktkategori'
  | 'rammeavtale'
  | 'delkontrakt'
  | 'setebreddeMinCM'
  | 'setebreddeMaksCM'
  | 'setedybdeMinCM'
  | 'setedybdeMaksCM'
  | 'setehoydeMinCM'
  | 'setehoydeMaksCM'

export type FilterCategoryKeyClient = 'vis' | 'status'

type RawFilterData = {
  [key in FilterCategoryKeyServer]: {
    doc_count: number
    buckets?: Array<Bucket>
    values?: { sum_other_doc_count?: number; buckets?: Array<Bucket> }
    sum_other_doc_count?: number
    min: { value: number }
    max: { value: number }
  }
}

export type Filter = {
  values: Array<Bucket>
  total_doc_count?: number
  min?: number
  max?: number
}

export const initialFilters: Record<FilterCategoryKeyServer, { total_doc_count: number; values: Bucket[] }> = {
  lengdeCM: {
    total_doc_count: 0,
    values: [],
  },
  breddeCM: {
    total_doc_count: 0,
    values: [],
  },
  brukervektMinKG: {
    total_doc_count: 0,
    values: [],
  },
  brukervektMaksKG: {
    total_doc_count: 0,
    values: [],
  },
  totalVektKG: {
    total_doc_count: 0,
    values: [],
  },
  fyllmateriale: {
    total_doc_count: 0,
    values: [],
  },
  materialeTrekk: {
    total_doc_count: 0,
    values: [],
  },
  beregnetBarn: {
    total_doc_count: 0,
    values: [],
  },
  leverandor: {
    total_doc_count: 0,
    values: [],
  },
  produktkategori: {
    total_doc_count: 0,
    values: [],
  },
  rammeavtale: {
    total_doc_count: 0,
    values: [],
  },
  delkontrakt: {
    total_doc_count: 0,
    values: [],
  },
  setebreddeMinCM: {
    total_doc_count: 0,
    values: [],
  },
  setebreddeMaksCM: {
    total_doc_count: 0,
    values: [],
  },
  setedybdeMinCM: {
    total_doc_count: 0,
    values: [],
  },
  setedybdeMaksCM: {
    total_doc_count: 0,
    values: [],
  },
  setehoydeMinCM: {
    total_doc_count: 0,
    values: [],
  },
  setehoydeMaksCM: {
    total_doc_count: 0,
    values: [],
  },
}

export type FilterData = {
  [key in FilterCategoryKeyServer | FilterCategoryKeyClient]: Filter
}

type FetchProps = {
  from: number
  size: number
  searchData: SearchData
  dontCollapse?: boolean
  seriesId?: string
}

export type FetchProductsWithFilters = {
  products: Product[]
  filters: FilterData
}

export type FetchProductVariantsWithFilters = {
  products: ProductVariant[]
  filters: FilterData
}

const makeSearchTermQuery = ({
  searchTerm,
  agreementId,
  seriesId,
}: {
  searchTerm: string
  agreementId?: string
  seriesId?: string
}) => {
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

  const queryStringSearchTerm = removeReservedChars(searchTerm)

  //Seksualhjelpemidler filtreres ut da de ikke skal vises lenger.
  const negativeIsoCategories = ['09540601', '09540901', '09540301']

  const bool = {
    should: [
      {
        boosting: {
          positive: {
            multi_match: {
              query: searchTerm,
              type: 'cross_fields',
              fields: [
                'isoCategoryTitle^2',
                'isoCategoryText^0.5',
                'title^0.3',
                'attributes.text^0.1',
                'keywords_bag^0.1',
              ],
              operator: 'and',
              zero_terms_query: 'all',
            },
          },
          ...commonBoosting,
        },
      },
      {
        boosting: {
          positive: {
            query_string: {
              query: `*${queryStringSearchTerm}`,
              boost: '0.1',
            },
          },
          ...commonBoosting,
        },
      },
      {
        boosting: {
          positive: {
            query_string: {
              query: `${queryStringSearchTerm}*`,
              boost: '0.1',
            },
          },
          ...commonBoosting,
        },
      },
    ],
  }

  const termAgreement = {
    'agreements.id': {
      value: agreementId,
    },
  }

  const termSeriesId = {
    seriesId: seriesId,
  }

  const mustAlternatives = () => {
    let must: any[] = [{ bool: bool }]
    if (agreementId !== undefined) {
      must = must.concat([{ term: termAgreement }])
    }

    if (seriesId !== undefined) {
      must = must.concat([{ term: termSeriesId }])
    }

    return must
  }

  const must = {
    must: mustAlternatives(),
    must_not: {
      bool: {
        should: negativeIsoCategories.map((isoCategory) => ({
          match: {
            isoCategory,
          },
        })),
      },
    },
  }

  return must
}

// Because of queryString in opensearch query: https://opensearch.org/docs/latest/query-dsl/full-text/query-string/#reserved-characters
const removeReservedChars = (searchTerm: String) => {
  const unescapables = /([<>\\])/g
  const queryStringReserved = /(\+|-|=|&&|\|\||!|\(|\)|\{|}|\[|]|\^|"|~|\*|\?|:|\/)/g
  return searchTerm.replaceAll(unescapables, '').replaceAll(queryStringReserved, '\\$&')
}

const sortOptionsOpenSearch = {
  Delkontrakt_rangering: [{ 'agreements.postNr': 'asc' }, { 'agreements.rank': 'asc' }],
  Best_soketreff: [{ _score: { order: 'desc' } }],
}

type QueryObject = {
  from: number
  size: number
  track_scores: boolean
  sort: any[]
  query: {}
  collapse?: {}
  post_filter: {}
  aggs: {}
}

export const fetchProducts = ({
  from,
  size,
  searchData,
  dontCollapse = false,
  seriesId,
}: FetchProps): Promise<FetchProductsWithFilters> => {
  const { searchTerm, isoCode, sortOrder, filters } = searchData
  const sortOrderOpenSearch = sortOrder ? sortOptionsOpenSearch[sortOrder] : sortOptionsOpenSearch['Best_soketreff']
  const searchTermQuery = makeSearchTermQuery({ searchTerm, seriesId })

  const {
    setebreddeMinCM,
    setebreddeMaksCM,
    setedybdeMinCM,
    setedybdeMaksCM,
    setehoydeMinCM,
    setehoydeMaksCM,
    lengdeMaxCM,
    lengdeMinCM,
    breddeMinCM,
    breddeMaxCM,
    totalVektMinKG,
    totalVektMaxKG,
    brukervektMinKG,
    brukervektMaksKG,
    beregnetBarn,
    fyllmateriale,
    materialeTrekk,
    leverandor,
    produktkategori,
    rammeavtale,
    vis,
    status,
  } = filters

  const filterKeyToAggsFilter: Record<Exclude<FilterCategoryKeyServer, 'delkontrakt'>, Object | null> = {
    lengdeCM: filterLengde(lengdeMinCM, lengdeMaxCM),
    breddeCM: filterBredde(breddeMinCM, breddeMaxCM),
    totalVektKG: filterTotalvekt(totalVektMinKG, totalVektMaxKG),
    setebreddeMinCM: filterMinMax({ setebreddeMinCM }, { setebreddeMaksCM }),
    setebreddeMaksCM: filterMinMax({ setebreddeMinCM }, { setebreddeMaksCM }),
    setedybdeMinCM: filterMinMax({ setedybdeMinCM }, { setedybdeMaksCM }),
    setedybdeMaksCM: filterMinMax({ setedybdeMinCM }, { setedybdeMaksCM }),
    setehoydeMinCM: filterMinMax({ setehoydeMinCM }, { setehoydeMaksCM }),
    setehoydeMaksCM: filterMinMax({ setehoydeMinCM }, { setehoydeMaksCM }),
    brukervektMinKG: filterMinMax({ brukervektMinKG }, { brukervektMaksKG }),
    brukervektMaksKG: filterMinMax({ brukervektMinKG }, { brukervektMaksKG }),
    beregnetBarn: filterBeregnetBarn(beregnetBarn),
    fyllmateriale: filterFyllmateriale(fyllmateriale),
    materialeTrekk: filterMaterialeTrekk(materialeTrekk),
    leverandor: filterLeverandor(leverandor),
    produktkategori: filterProduktkategori(produktkategori),
    rammeavtale: filterRammeavtale(rammeavtale),
  }

  const aggsFilter = (filterKey: FilterCategoryKeyServer, aggs: {}) => ({
    [filterKey]: {
      filter: {
        bool: {
          filter: Object.entries(filterKeyToAggsFilter)
            .filter(([key, v]) => key !== filterKey && v != null)
            .map(([_, v]) => v),
        },
      },
      aggs,
    },
  })

  const queryFilters: Array<any> = []

  if (isoCode) {
    queryFilters.push({
      match_bool_prefix: {
        isoCategory: isoCode,
      },
    })
  }

  // "Probably" hmsArtNr (searchTerm is a number consisting of exactly 6 digits)
  if (searchTerm.length === 6 && !isNaN(parseInt(searchTerm))) {
    queryFilters.push({ match: { hmsArtNr: { query: searchTerm } } })
  }

  const query = {
    bool: {
      ...searchTermQuery,
      filter: queryFilters,
    },
  }

  const filterBreddePrint = filterMinMax({ setebreddeMinCM }, { setebreddeMaksCM })

  const body: QueryObject = {
    from,
    size,
    track_scores: true,
    sort: sortOrderOpenSearch,
    query,
    post_filter: {
      bool: {
        filter: [
          filterLengde(lengdeMinCM, lengdeMaxCM),
          filterBredde(breddeMinCM, breddeMaxCM),
          filterTotalvekt(totalVektMinKG, totalVektMaxKG),
          filterMinMax({ setebreddeMinCM }, { setebreddeMaksCM }),
          filterMinMax({ setedybdeMinCM }, { setedybdeMaksCM }),
          filterMinMax({ setehoydeMinCM }, { setehoydeMaksCM }),
          filterMinMax({ brukervektMinKG }, { brukervektMaksKG }),
          filterBeregnetBarn(beregnetBarn),
          filterFyllmateriale(fyllmateriale),
          filterMaterialeTrekk(materialeTrekk),
          filterLeverandor(leverandor),
          filterProduktkategori(produktkategori),
          filterRammeavtale(rammeavtale),
          //Filtrer bare på aktive produkter dersom vi ikke henter basert på serieId(produktside)
          ...filterVis(seriesId === undefined, vis),
          filterStatus(status),
          //Remove null values
        ].filter(Boolean),
      },
    },
    aggs: {
      ...aggsFilter('lengdeCM', toMinMaxAggs(`filters.lengdeCM`)),
      ...aggsFilter('breddeCM', toMinMaxAggs(`filters.breddeCM`)),
      ...aggsFilter('totalVektKG', toMinMaxAggs(`filters.totalVektKG`)),
      ...aggsFilter('setebreddeMinCM', toMinMaxAggs(`filters.setebreddeMinCM`)),
      ...aggsFilter('setebreddeMaksCM', toMinMaxAggs(`filters.setebreddeMaksCM`)),
      ...aggsFilter('setedybdeMinCM', toMinMaxAggs(`filters.setedybdeMinCM`)),
      ...aggsFilter('setedybdeMaksCM', toMinMaxAggs(`filters.setedybdeMaksCM`)),
      ...aggsFilter('setehoydeMinCM', toMinMaxAggs(`filters.setehoydeMinCM`)),
      ...aggsFilter('setehoydeMaksCM', toMinMaxAggs(`filters.setehoydeMaksCM`)),
      ...aggsFilter('brukervektMinKG', toMinMaxAggs(`filters.brukervektMinKG`)),
      ...aggsFilter('brukervektMaksKG', toMinMaxAggs(`filters.brukervektMaksKG`)),
      ...aggsFilter('beregnetBarn', {
        values: { terms: { field: 'filters.beregnetBarn', order: { _key: 'asc' } } },
      }),
      ...aggsFilter('fyllmateriale', {
        values: {
          terms: { field: 'filters.fyllmateriale', order: { _key: 'asc' }, size: 100 },
        },
      }),
      ...aggsFilter('materialeTrekk', {
        values: {
          terms: { field: 'filters.materialeTrekk', order: { _key: 'asc' }, size: 100 },
        },
      }),
      ...aggsFilter('leverandor', {
        values: {
          terms: { field: 'supplier.name', order: { _key: 'asc' }, size: 300 },
        },
      }),
      ...aggsFilter('produktkategori', {
        values: {
          terms: { field: 'isoCategoryName', size: 100 },
        },
      }),
      ...aggsFilter('rammeavtale', {
        values: {
          terms: { field: 'agreements.label', order: { _key: 'asc' }, size: 100 },
        },
      }),
    },
  }

  if (!dontCollapse) {
    body.collapse = {
      field: 'seriesId',
    }
  }

  return fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      const products = dontCollapse
        ? data.hits.hits.length > 0
          ? new Array(mapProductFromSeriesId(data))
          : []
        : mapProductsFromCollapse(data)

      return {
        products: products,
        filters: mapFilters(data),
      }
    })
}

export const getProductFilters = ({ seriesId }: { seriesId: string }): Promise<FilterData> => {
  const query = {
    bool: {
      must: {
        term: {
          seriesId: seriesId,
        },
      },
    },
  }

  const filterKeyToAggsFilter: Record<Exclude<FilterCategoryKeyServer, 'delkontrakt'>, Object | null> = {
    lengdeCM: filterLengde(undefined, undefined),
    breddeCM: filterBredde(undefined, undefined),
    totalVektKG: filterTotalvekt(undefined, undefined),
    setebreddeMinCM: filterMinMax({ setebreddeMinCM: undefined }, { setebreddeMaksCM: undefined }),
    setebreddeMaksCM: filterMinMax({ setebreddeMinCM: undefined }, { setebreddeMaksCM: undefined }),
    setedybdeMinCM: filterMinMax({ setedybdeMinCM: undefined }, { setedybdeMaksCM: undefined }),
    setedybdeMaksCM: filterMinMax({ setedybdeMinCM: undefined }, { setedybdeMaksCM: undefined }),
    setehoydeMinCM: filterMinMax({ setehoydeMinCM: undefined }, { setehoydeMaksCM: undefined }),
    setehoydeMaksCM: filterMinMax({ setehoydeMinCM: undefined }, { setehoydeMaksCM: undefined }),
    brukervektMinKG: filterMinMax({ brukervektMinKG: undefined }, { brukervektMaksKG: undefined }),
    brukervektMaksKG: filterMinMax({ brukervektMinKG: undefined }, { brukervektMaksKG: undefined }),
    beregnetBarn: filterBeregnetBarn([]),
    fyllmateriale: filterFyllmateriale([]),
    materialeTrekk: filterMaterialeTrekk([]),
    leverandor: filterLeverandor([]),
    produktkategori: filterProduktkategori([]),
    rammeavtale: filterRammeavtale([]),
  }

  const aggsFilter = (filterKey: FilterCategoryKeyServer, aggs: {}) => ({
    [filterKey]: {
      filter: {
        bool: {
          filter: Object.entries(filterKeyToAggsFilter)
            .filter(([key, v]) => key !== filterKey && v != null)
            .map(([_, v]) => v),
        },
      },
      aggs,
    },
  })

  return fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: 0,
      query,
      aggs: {
        ...aggsFilter('lengdeCM', toMinMaxAggs(`filters.lengdeCM`)),
        ...aggsFilter('breddeCM', toMinMaxAggs(`filters.breddeCM`)),
        ...aggsFilter('totalVektKG', toMinMaxAggs(`filters.totalVektKG`)),
        ...aggsFilter('setebreddeMinCM', toMinMaxAggs(`filters.setebreddeMinCM`)),
        ...aggsFilter('setebreddeMaksCM', toMinMaxAggs(`filters.setebreddeMaksCM`)),
        ...aggsFilter('setedybdeMinCM', toMinMaxAggs(`filters.setedybdeMinCM`)),
        ...aggsFilter('setedybdeMaksCM', toMinMaxAggs(`filters.setedybdeMaksCM`)),
        ...aggsFilter('setehoydeMinCM', toMinMaxAggs(`filters.setehoydeMinCM`)),
        ...aggsFilter('setehoydeMaksCM', toMinMaxAggs(`filters.setehoydeMaksCM`)),
        ...aggsFilter('brukervektMinKG', toMinMaxAggs(`filters.brukervektMinKG`)),
        ...aggsFilter('brukervektMaksKG', toMinMaxAggs(`filters.brukervektMaksKG`)),
        ...aggsFilter('beregnetBarn', {
          values: { terms: { field: 'filters.beregnetBarn', order: { _key: 'asc' } } },
        }),
        ...aggsFilter('fyllmateriale', {
          values: {
            terms: { field: 'filters.fyllmateriale', order: { _key: 'asc' }, size: 100 },
          },
        }),
        ...aggsFilter('materialeTrekk', {
          values: {
            terms: { field: 'filters.materialeTrekk', order: { _key: 'asc' }, size: 100 },
          },
        }),
      },
    }),
  })
    .then((res) => res.json())
    .then((data: any) => {
      return mapFilters(data)
    })
}

//TODO bytte til label
export const getProductsOnAgreement = ({
  agreementId,
  searchData,
}: {
  agreementId: string
  searchData: SearchData
}): Promise<PostBucketResponse[]> => {
  const { searchTerm, filters: activeFilters } = searchData

  const { leverandor, delkontrakt } = activeFilters
  const allActiveFilters = [filterLeverandor(leverandor), filterDelkontrakt(delkontrakt)]

  const searchTermQuery = makeSearchTermQuery({ searchTerm, agreementId })

  const query = {
    bool: {
      filter: allActiveFilters,
      ...searchTermQuery,
    },
  }

  const aggs = {
    postNr: {
      terms: {
        field: 'agreements.postNr',
        size: 1000,
        order: {
          _key: 'asc',
        },
      },
      aggs: {
        topHitData: {
          top_hits: {
            size: 500,
            _source: {
              includes: ['*'],
            },
          },
        },
      },
    },
  }

  return fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: 0,
      sort: [{ 'agreements.postNr': 'asc' }, { 'agreements.rank': 'asc' }],
      query,
      aggs,
    }),
  })
    .then((res) => res.json())
    .then((data: AgreementSearchResponse) => {
      return data.aggregations.postNr.buckets
    })
}

export const getFiltersAgreement = ({ agreementId }: { agreementId: string }): Promise<FilterData> => {
  const query = {
    bool: {
      must: {
        term: {
          'agreements.id': {
            value: agreementId,
          },
        },
      },
    },
  }

  const filters = {
    leverandor: {
      filter: {
        bool: {
          filter: [],
        },
      },
      aggs: {
        values: {
          terms: { field: 'supplier.name', order: { _key: 'asc' }, size: 300 },
        },
      },
    },
  }

  return fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: 0,
      query,
      aggs: { ...filters },
    }),
  })
    .then((res) => res.json())
    .then((data: any) => {
      const filters = {
        aggregations: {
          leverandor: data.aggregations.leverandor,
        },
      }
      return mapFilters(filters)
    })
}

const mapFilters = (data: any): FilterData => {
  const rawFilterData: RawFilterData = data.aggregations

  return Object.entries(rawFilterData)
    .filter(([_, data]) => data.doc_count > 0)
    .reduce((obj, [k, data]) => {
      const key = k as FilterCategoryKeyServer
      obj[key] = {
        total_doc_count: data.doc_count,
        values: data.buckets || data.values?.buckets || [],
        ...(data.min && { min: data.min.value }),
        ...(data.max && { max: data.max.value }),
      }

      return obj
    }, {} as FilterData)
}

export async function getSupplier(id: string) {
  const res = await fetch(HM_SEARCH_URL + `/suppliers/_doc/${id}`, {
    next: { revalidate: 900 },
    method: 'GET',
  })

  return res.json()
}

export async function getAgreement(id: string): Promise<AgreementDocResponse> {
  const res = await fetch(HM_SEARCH_URL + `/agreements/_doc/${id}`, {
    next: { revalidate: 900 },
    method: 'GET',
  })
  return res.json()
}

export async function getAgreementLabels(): Promise<AgreementLabel[]> {
  const res = await fetch(HM_SEARCH_URL + `/agreements/_search`, {
    next: { revalidate: 900 },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: 100,
      query: {
        term: {
          status: {
            value: 'ACTIVE',
          },
        },
      },
      _source: {
        includes: ['id', 'label', 'identifier', 'title', 'published', 'expired'],
      },
    }),
  })

  return res.json().then(mapAgreementLabels)
}

export type FetchProductsWithPaginationResponse = {
  products: Product[]
  totalHits: number
}

export const fetchAccessoriesAndSpareParts = ({
  agreementId,
  searchTerm,
  selectedSupplier,
  currentPage,
  pageSize,
  isSparepart,
}: {
  agreementId: string
  searchTerm: string
  selectedSupplier?: string
  currentPage: number
  pageSize: number
  isSparepart: boolean
}): Promise<FetchProductsWithPaginationResponse> => {
  const termQuery = {
    multi_match: {
      query: searchTerm,
      type: 'bool_prefix',
      operator: 'and',
      fields: ['title', 'hmsArtNr', 'supplierRef', 'supplier.name'],
      lenient: true,
    },
  }
  const selectedSupplierQuery = {
    term: { 'supplier.name': { value: selectedSupplier } },
  }


  let must: any[] = [
    {
      term: {
        'agreements.id': {
          value: agreementId,
        },
      }
    },

  ]

  if (searchTerm) {
    must = must.concat([termQuery])
  }
  if (selectedSupplier) {
    must = must.concat([selectedSupplierQuery])
  }

  if (isSparepart) {
    must = must.concat([{
      term: { sparePart: true },
    }])
  } else {
    must = must.concat([{
      term: { accessory: true },
    }])
  }

  return fetch(HM_SEARCH_URL + `/products/_search`, {
    next: { revalidate: 900 },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: pageSize,
      from: pageSize * (currentPage - 1),
      query: {
        bool: {
          must: must,
        },
      },
      track_total_hits: true,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      return { products: mapProductsFromCollapse(data), totalHits: data.hits.total.value }
    })
}

export async function getSuppliers(letter: string): Promise<Supplier[]> {
  letter = formatNorwegianLetter(letter)

  const res = await fetch(HM_SEARCH_URL + `/suppliers/_search`, {
    next: { revalidate: 900 },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        match_phrase_prefix: {
          name_startswith: letter,
        },
      },
      _source: {
        includes: ['id', 'identifier', 'name', 'address', 'homepage'],
      },
    }),
  })

  return res.json().then(mapSuppliers)
}

export async function getAllSuppliers(): Promise<Supplier[]> {
  const res = await fetch(HM_SEARCH_URL + `/suppliers/_search`, {
    next: { revalidate: 900 },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: 400,
      query: {
        term: {
          status: {
            value: 'ACTIVE',
          },
        },
      },
      sort: [
        {
          name_keyword: {
            order: 'asc',
          },
        },
      ],
      _source: {
        includes: ['id', 'identifier', 'postNr', 'postLocation', 'name', 'address', 'homepage', 'status'],
      },
    }),
  })
  return res.json().then(mapSuppliers)
}

export async function getProductWithVariants(seriesId: string): Promise<SearchResponse> {
  const res = await fetch(HM_SEARCH_URL + '/products/_search', {
    next: { revalidate: 900 },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        bool: {
          must: {
            term: {
              seriesId: seriesId,
            },
          },
        },
      },
      size: 150,
    }),
  })

  return res.json()
}

export async function getProductWithVariantsSuggestions(
  seriesId: string,
  setebredde: string,
  setedybde: string
): Promise<HMSSuggestionWheelChair[]> {
  const setebreddeMinCM = setebredde
  const setebreddeMaksCM = setebredde
  const setedybdeMinCM = setedybde
  const setedybdeMaksCM = setedybde

  const breddeFilter = filterMinMax({ setebreddeMinCM }, { setebreddeMaksCM }, true)
  const dybdeFilter = filterMinMax({ setedybdeMinCM }, { setedybdeMaksCM }, true)

  const res = await fetch(HM_SEARCH_URL + '/products/_search', {
    next: { revalidate: 900 },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        bool: {
          must: {
            term: {
              seriesId: seriesId,
            },
          },
        },
      },
      post_filter: {
        bool: {
          filter: [
            filterMinMax({ setebreddeMinCM }, { setebreddeMaksCM }, true),
            filterMinMax({ setedybdeMinCM }, { setedybdeMaksCM }, true),
            //Remove null values
          ].filter(Boolean),
        },
      },
      size: 150,
    }),
  })
  return res.json().then((data) => {
    const suggestions = mapHMSSuggestionFromSearchResponse(data)

    // Calculate the differences between user input and range values for each product
    suggestions.forEach((suggestion) => {
      let totalDiff = 0

      // Calculate the difference for each wheelchair filter and add it to the total difference
      wheelchairFilters.forEach((filter) => {
        const value = suggestion[filter]
        if (value) {
          const filterValue = Number(value)
          if (!isNaN(filterValue)) {
            const userInputValue = filter.includes('Setebredde') ? Number(setebredde) : Number(setedybde)
            totalDiff += Math.abs(filterValue - userInputValue)
          }
        }
      })

      suggestion.totalDiff = totalDiff
    })

    // Sort the list based on the total difference (ascending order)
    suggestions.sort((a, b) => a.totalDiff! - b.totalDiff!)

    return suggestions
  })
}

export type FetchSeriesResponse = {
  products: Product[]
}

export const fetchProductsWithVariants = (seriesIds: string[]): Promise<FetchSeriesResponse> => {
  return fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: 0,
      query: {
        bool: {
          must: {
            terms: {
              seriesId: seriesIds,
            },
          },
        },
      },
      sort: [{ _score: { order: 'desc' } }, { 'agreements.postNr': 'asc' }, { 'agreements.rank': 'asc' }],
      aggregations: {
        series_buckets: {
          composite: {
            sources: [
              {
                seriesId: {
                  terms: {
                    field: 'seriesId',
                  },
                },
              },
            ],
          },
          aggregations: {
            products: {
              top_hits: {
                size: 150,
              },
            },
          },
        },
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      return {
        products: mapProductsFromAggregation(data),
      }
    })
}

export async function getProductsInPost(agreementId: string, postNr: number): Promise<SearchResponse> {
  const query = {
    bool: {
      must: [
        {
          term: {
            'agreements.id': {
              value: agreementId,
            },
          },
        },
        {
          term: {
            'agreements.postNr': {
              value: postNr,
            },
          },
        },
      ],
    },
  }

  const res = await fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      size: 200,
      collapse: {
        field: 'seriesId',
      },
    }),
  })
  return res.json()
}

export type Suggestions = Array<{ text: string; data: ProductVariant }>

//TODO: Bør denne returnere Product? Vet ikke om vi trenger det
export const fetchSuggestions = (term: string): Promise<Suggestions> => {
  return fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      suggest: {
        keywords_suggest: {
          prefix: term,
          completion: {
            field: 'keywords_suggest',
            skip_duplicates: true,
            contexts: {
              status: 'ACTIVE',
            },
            size: 20,
            fuzzy: {
              fuzziness: 'AUTO',
            },
          },
        },
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const suggestions: Suggestions = data.suggest.keywords_suggest
        .at(0)
        .options.map((suggestion: any) => ({ text: suggestion.text, data: mapProductVariant(suggestion._source) }))
      return suggestions
    })
}

export async function getNews(): Promise<News[]> {
  const res = await fetch(HM_SEARCH_URL + `/news/_search`, {
    next: { revalidate: 900 },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: 100,
      query: {
        term: {
          status: {
            value: 'ACTIVE',
          },
        },
      },
      _source: {
        includes: ['id', 'identifier', 'title', 'text', 'status', 'published', 'expired'],
      },
    }),
  })
  return res.json().then(mapAllNews)
}

export const fetcherGET: Fetcher<any, string> = (url) =>
  fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        throw new CustomError(data.errorMessage || res.statusText, res.status);
      });
    }
    return res.json();
  });

export class CustomError extends Error {
  status: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CustomError";
    this.status = statusCode;
  }
}
