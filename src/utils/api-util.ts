import { mapProducts, Product } from './product-util'
import {
  filterBeregnetBarn,
  filterBredde,
  FilterCategories,
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
  filterTotalvekt,
  toMinMaxAggs,
} from './filter-util'

export const PAGE_SIZE = 25

export type SelectedFilters = Record<keyof typeof FilterCategories, Array<any>>
export type Bucket = { key: number | string; doc_count: number }

export type RawFilterData = {
  [key in FilterCategories]: {
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
  [key in FilterCategories as keyof typeof FilterCategories]: Filter
}

export type SearchData = {
  searchTerm: string
  isoCode: string
  hasRammeavtale: boolean
  filters: SelectedFilters
}

export type SearchParams = SearchData & { to?: number }

type FetchProps = {
  url: string
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

export const fetchProducts = ({
  url,
  from,
  to,
  searchData,
  isProductSeriesView,
}: FetchProps): Promise<FetchResponse> => {
  const { searchTerm, isoCode, hasRammeavtale, filters } = searchData
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
  } = filters

  const queryFilters: Array<any> = [
    {
      term: {
        status: 'ACTIVE',
      },
    },
    {
      match_bool_prefix: {
        hasAgreement: hasRammeavtale,
      },
    },
  ]

  if (isoCode) {
    queryFilters.push({
      match_bool_prefix: {
        isoCategory: isoCode,
      },
    })
  }

  // "Probably" hmsArtNr (searchTerm is a number consisting of exactly 6 digits)
  if (searchTerm.length === 6 && !isNaN(parseInt(searchTerm))) {
    queryFilters.push({ match: { hmsArtNr: { query: searchTerm, boost: 10 } } })
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
                fields: ['isoCategoryTitle^2', 'isoCategoryText^0.5', 'title^0.3', 'attributes.text^0.1', '*'],
                operator: 'and',
                zero_terms_query: 'all',
              },
            },
          ],
        },
      },
      should: [
        {
          match_phrase: {
            title: {
              query: searchTerm,
              slop: 2,
            },
          },
        },
      ],
      filter: queryFilters,
    },
  }

  const post_filter = {
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
  }

  return fetch(url, {
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
      post_filter,
      aggs: {
        lengdeCM: {
          filter: {
            bool: {
              filter: [
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
              ],
            },
          },
          aggs: {
            values: {
              terms: { field: 'isoCategoryName', size: 100 },
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
    .reduce((obj, [key, data]) => {
      return {
        ...obj,
        [key]: {
          total_doc_count: data.doc_count,
          values: data.buckets || data.values?.buckets,
          ...(data.min && { min: data.min.value }),
          ...(data.max && { max: data.max.value }),
        },
      }
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
      must: [{ term: { seriesId } }, { exists: { field: 'data' } }],
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
