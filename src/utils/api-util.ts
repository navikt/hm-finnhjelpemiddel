import { agreementKeyLabels } from './agreement-util'
import {
  FilterCategories,
  filterBeregnetBarn,
  filterBredde,
  filterFyllmateriale,
  filterLengde,
  filterLeverandor,
  filterMaksBrukervekt,
  filterMaksSetebredde,
  filterMaksSetedybde,
  filterMaksSetehoyde,
  filterMaterialeTrekk,
  filterMinBrukervekt,
  filterMinSetebredde,
  filterMinSetedybde,
  filterMinSetehoyde,
  filterProduktkategori,
  filterRammeavtale,
  filterTotalvekt,
  toMinMaxAggs,
} from './filter-util'
import { Product, mapProduct, mapProducts } from './product-util'
import { SearchResponse } from './response-types'

export const PAGE_SIZE = 25

export type SelectedFilters = Record<keyof typeof FilterCategories, Array<any>>
export type Bucket = {
  key: number | string
  doc_count: number
  label?: string
}

type FilterCategoryKey = keyof typeof FilterCategories

type RawFilterData = {
  [key in FilterCategoryKey]: {
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
  min: number
  max: number
}

export type FilterData = {
  [key in FilterCategoryKey]: Filter
}

export type SearchData = {
  searchTerm: string
  isoCode: string
  hasAgreementsOnly: boolean
  filters: SelectedFilters
}

export type SearchParams = SearchData & { to?: number }

type FetchProps = {
  from: number
  to: number
  searchData: SearchData
  isProductSeriesView: boolean
}

export type FetchResponse = {
  numberOfProducts: number
  products: Product[]
  filters: FilterData
}

//SWR fetcher
export const fetchProducts = ({ from, to, searchData, isProductSeriesView }: FetchProps): Promise<FetchResponse> => {
  const { searchTerm, isoCode, hasAgreementsOnly, filters } = searchData
  const {
    lengdeCM,
    breddeCM,
    totalVektKG,
    setebreddeMinCM,
    setebreddeMaksCM,
    setedybdeMinCM,
    setedybdeMaksCM,
    setehoydeMinCM,
    setehoydeMaksCM,
    brukervektMinKG,
    brukervektMaksKG,
    beregnetBarn,
    fyllmateriale,
    materialeTrekk,
    leverandor,
    produktkategori,
    rammeavtale,
  } = filters

  const allFilters = [
    filterLengde(lengdeCM),
    filterBredde(breddeCM),
    filterTotalvekt(totalVektKG),
    filterMinSetebredde(setebreddeMinCM),
    filterMaksSetebredde(setebreddeMaksCM),
    filterMinSetedybde(setedybdeMinCM),
    filterMaksSetedybde(setedybdeMaksCM),
    filterMinSetehoyde(setehoydeMinCM),
    filterMaksSetehoyde(setehoydeMaksCM),
    filterMinBrukervekt(brukervektMinKG),
    filterMaksBrukervekt(brukervektMaksKG),
    filterBeregnetBarn(beregnetBarn),
    filterFyllmateriale(fyllmateriale),
    filterMaterialeTrekk(materialeTrekk),
    filterLeverandor(leverandor),
    filterProduktkategori(produktkategori),
    filterRammeavtale(rammeavtale),
  ]

  const queryFilters: Array<any> = [
    {
      term: {
        status: 'ACTIVE',
      },
    },
  ]

  if (hasAgreementsOnly) {
    queryFilters.push({
      match_bool_prefix: {
        hasAgreement: hasAgreementsOnly,
      },
    })
  }

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
      must: {
        bool: {
          should: [
            {
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
            {
              query_string: {
                query: `*${searchTerm}`,
                boost: '0.1',
              },
            },
            {
              query_string: {
                query: `${searchTerm}*`,
                boost: '0.1',
              },
            },
          ],
        },
      },
      filter: queryFilters,
    },
  }

  return fetch('/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      size: to,
      track_scores: true,
      sort: [{ _score: { order: 'desc' } }, { 'agreementInfo.postNr': 'asc' }, { 'agreementInfo.rank': 'asc' }],
      query,
      ...(isProductSeriesView && {
        collapse: {
          field: 'attributes.series',
        },
      }),
      post_filter: {
        bool: {
          filter: allFilters,
        },
      },
      aggs: {
        lengdeCM: {
          filter: {
            bool: {
              filter: allFilters,
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.lengdeCM'),
          },
        },
        breddeCM: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.breddeCM'),
          },
        },
        totalVektKG: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.totalVektKG'),
          },
        },
        setebreddeMinCM: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.setebreddeMinCM'),
          },
        },
        setebreddeMaksCM: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.setebreddeMaksCM'),
          },
        },
        setedybdeMinCM: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.setedybdeMinCM'),
          },
        },
        setedybdeMaksCM: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.setedybdeMaksCM'),
          },
        },
        setehoydeMinCM: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.setehoydeMinCM'),
          },
        },
        setehoydeMaksCM: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.setehoydeMaksCM'),
          },
        },
        brukervektMinKG: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.brukervektMinKG'),
          },
        },
        brukervektMaksKG: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            ...toMinMaxAggs('filters.brukervektMaksKG'),
          },
        },
        beregnetBarn: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.beregnetBarn', order: { _key: 'asc' } } },
          },
        },
        fyllmateriale: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            values: {
              terms: { field: 'filters.fyllmateriale', order: { _key: 'asc' }, size: 100 },
            },
          },
        },
        materialeTrekk: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterFyllmateriale(fyllmateriale),
                filterBeregnetBarn(beregnetBarn),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            values: {
              terms: { field: 'filters.materialeTrekk', order: { _key: 'asc' }, size: 100 },
            },
          },
        },
        leverandor: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterProduktkategori(produktkategori),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            values: {
              terms: { field: 'supplier.name', order: { _key: 'asc' }, size: 100 },
            },
          },
        },
        produktkategori: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterRammeavtale(rammeavtale),
              ],
            },
          },
          aggs: {
            values: {
              terms: { field: 'isoCategoryName', size: 100 },
            },
          },
        },
        rammeavtale: {
          filter: {
            bool: {
              filter: [
                filterLengde(lengdeCM),
                filterBredde(breddeCM),
                filterTotalvekt(totalVektKG),
                filterMinSetebredde(setebreddeMinCM),
                filterMaksSetebredde(setebreddeMaksCM),
                filterMinSetedybde(setedybdeMinCM),
                filterMaksSetedybde(setedybdeMaksCM),
                filterMinSetehoyde(setehoydeMinCM),
                filterMaksSetehoyde(setehoydeMaksCM),
                filterMinBrukervekt(brukervektMinKG),
                filterMaksBrukervekt(brukervektMaksKG),
                filterBeregnetBarn(beregnetBarn),
                filterFyllmateriale(fyllmateriale),
                filterMaterialeTrekk(materialeTrekk),
                filterLeverandor(leverandor),
                filterProduktkategori(produktkategori),
              ],
            },
          },
          aggs: {
            values: {
              terms: { field: 'agreementInfo.identifier', size: 100 },
            },
          },
        },
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const products: Product[] = mapProducts(data)
      return { numberOfProducts: data.hits.total.value, products, filters: mapFilters(data) }
    })
}

const mapFilters = (data: any): FilterData => {
  const rawFilterData: RawFilterData = data.aggregations

  return Object.entries(rawFilterData)
    .filter(([_, data]) => data.doc_count > 0)
    .reduce((obj, [k, data]) => {
      const key = k as FilterCategoryKey
      obj[key] = {
        total_doc_count: data.doc_count,
        values: data.buckets || data.values?.buckets || [],
        ...(data.min && { min: data.min.value }),
        ...(data.max && { max: data.max.value }),
      }
      //Midlertidig der hvor vi ikke har en tittel som passer seg å vise i UI
      if (key === 'rammeavtale') {
        obj[key].values = obj[key].values.map((bucket) => {
          bucket.label = bucket.key in agreementKeyLabels ? agreementKeyLabels[bucket.key] : undefined
          return bucket
        })
      }
      return obj
    }, {} as FilterData)
}

export async function getProduct(id: string) {
  const res = await fetch(process.env.HM_SEARCH_URL + `/products/_doc/${id}`, {
    method: 'GET',
  })

  return res.json()
}

export async function getSupplier(id: string) {
  const res = await fetch(process.env.HM_SEARCH_URL + `/suppliers/_doc/${id}`, {
    method: 'GET',
  })

  return res.json()
}

export async function getAgreement(id: string) {
  const res = await fetch(process.env.HM_SEARCH_URL + `/agreements/_doc/${id}`, {
    method: 'GET',
  })

  return res.json()
}

export async function getSeries(seriesId: string) {
  const query = {
    bool: {
      must: [{ term: { seriesId } }, { exists: { field: 'seriesId' } }],
    },
  }

  const res = await fetch(process.env.HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      size: 100,
    }),
  })
  return res.json()
}

//SWR fetcher
export const fetchSeries = (seriesIds: string[]): Promise<any> => {
  console.log('fetch:', seriesIds)

  return fetch('/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: 0,
      query: {
        terms: {
          seriesId: seriesIds,
        },
      },
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
  }).then((res) => res.json())
}

export const mapASD = (data: any): Product[] => {
  return data.aggregations.series.buckets.map((hit: any) => hit.hits.map((hit: any) => mapProduct(hit._source)))
}

export async function getProductsInPost(postIdentifier: string) {
  const query = {
    bool: {
      must: [{ term: { 'agreementInfo.postIdentifier': { value: postIdentifier } } }],
    },
  }

  const res = await fetch(process.env.HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      size: 100,
      collapse: {
        field: 'attributes.series',
      },
    }),
  })
  return res.json()
}
