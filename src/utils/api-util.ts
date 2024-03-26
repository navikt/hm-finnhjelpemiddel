import { mapAllNews } from '@/utils/news-util'
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
  filterTotalvekt,
  filterVis,
  toMinMaxAggs,
} from './filter-util'
import {
  mapProductsFromAggregation,
  mapProductsFromCollapse,
  mapProductVariant,
  Product,
  ProductVariant,
} from './product-util'
import {
  AgreementDocResponse,
  AgreementSearchResponse,
  NewsType,
  PostBucketResponse,
  ProductDocResponse,
  SearchResponse,
} from './response-types'
import { SearchData } from './search-state-util'

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

export type FilterCategoryKeyClient = 'vis'

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
}

export type FetchProductsWithFilters = {
  products: Product[]
  filters: FilterData
}

const makeSearchTermQuery = (searchTerm: string, agreementId?: string) => {
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

  const term = {
    'agreements.id': {
      value: agreementId,
    },
  }

  const mustForAgreement = {
    must: [
      { term: term },
      {
        bool: {
          must: { bool: bool },
          must_not: {
            bool: {
              should: negativeIsoCategories.map((isoCategory) => ({
                match: {
                  isoCategory,
                },
              })),
            },
          },
        },
      },
    ],
  }

  const mustForAll = {
    must: { bool: bool },
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

  return agreementId === undefined ? mustForAll : mustForAgreement
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

export const fetchProducts = ({ from, size, searchData }: FetchProps): Promise<FetchProductsWithFilters> => {
  const { searchTerm, isoCode, sortOrder, filters } = searchData

  const sortOrderOpenSearch = sortOrder ? sortOptionsOpenSearch[sortOrder] : sortOptionsOpenSearch['Best_soketreff']

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
            .map(([_, v]) => v)
            .concat(filterVis(vis)),
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

  const searchTermQuery = makeSearchTermQuery(searchTerm)

  const query = {
    bool: {
      ...searchTermQuery,
      filter: queryFilters,
    },
  }

  return fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      size,
      track_scores: true,
      sort: sortOrderOpenSearch,
      query,
      collapse: {
        field: 'seriesId',
      },
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
            ...filterVis(vis),
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
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      return { products: mapProductsFromCollapse(data), filters: mapFilters(data) }
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

  const searchTermQuery = makeSearchTermQuery(searchTerm, agreementId)

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

export async function getProduct(id: string): Promise<ProductDocResponse> {
  const res = await fetch(HM_SEARCH_URL + `/products/_doc/${id}`, {
    method: 'GET',
  })

  return res.json()
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
          "name_keyword": {
            "order": "asc"
          }
        }
      ],
      _source: {
        includes: ['id', 'identifier', 'name', 'address', 'homepage', 'status'],
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

export async function getNews(): Promise<NewsType[]> {
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
