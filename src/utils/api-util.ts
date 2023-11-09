import { AgreementLabel, mapAgreementLabels } from './agreement-util'
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
import {
  Product,
  ProductVariant,
  mapProductVariant,
  mapProductsFromAggregation,
  mapProductsFromCollapse,
} from './product-util'
import { ProductDocResponse, SearchResponse } from './response-types'

export const PAGE_SIZE = 25

//if HM_SEARCH_URL is undefined it means that we are on the client and we want to use relative url
const HM_SEARCH_URL = process.env.HM_SEARCH_URL || ''

export type SelectedFilters = Record<keyof typeof FilterCategories, Array<any>>
export type Bucket = {
  key: number | string
  doc_count: number
  label: string
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
  size: number
  searchData: SearchData
}

export type FetchResponse = {
  products: Product[]
  filters: FilterData
}

export const fetchProducts = ({ from, size, searchData }: FetchProps): Promise<FetchResponse> => {
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

  //Seksualhjelpemidler boostes negativt slik at de kommer langt ned i listen når søk ikke er initiert
  const negativeIsoCategories = ['09540601', '09540901', '09540301']

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const commonBoosting = {
    negative: {
      bool: {
        must: {
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
    //Dersom man har gjort et søk eller valgt et filter ønsker vi ikke negativ boost på seksualhjelpemidler
    //Ganges med 1 betyr samme boost. Ganges med et mindre tall betyr lavere boost og kommer lenger ned. Om den settes til 0 forsvinner den helt fordi alt som ganges med 0 er 0
    negative_boost: searchData.searchTerm.length || searchDataFilters.length ? 1 : 0.1,
  }

  const searchTermQuery = {
    must: {
      bool: {
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
                  query: `*${searchTerm}`,
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
                  query: `${searchTerm}*`,
                  boost: '0.1',
                },
              },
              ...commonBoosting,
            },
          },
        ],
      },
    },
  }

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
      sort: [{ _score: { order: 'desc' } }, { 'agreementInfo.postNr': 'asc' }, { 'agreementInfo.rank': 'asc' }],
      query,
      collapse: {
        field: 'seriesId',
      },
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
              terms: { field: 'agreementInfo.label', size: 100 },
            },
          },
        },
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => ({ products: mapProductsFromCollapse(data), filters: mapFilters(data) }))
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

export async function getAgreement(id: string) {
  const res = await fetch(HM_SEARCH_URL + `/agreements/_doc/${id}`, {
    next: { revalidate: 900 },
    method: 'GET',
  })

  return res.json()
}

export async function getAgreementFromId(id: string): Promise<SearchResponse> {
  const res = await fetch(HM_SEARCH_URL + `/agreements/_search`, {
    next: { revalidate: 900 },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        term: {
          id: {
            value: id,
          },
        },
      },
    }),
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
        includes: ['id', 'label', 'identifier', 'title'],
      },
    }),
  })

  return res.json().then(mapAgreementLabels)
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
        term: {
          seriesId: seriesId,
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
        terms: {
          seriesId: seriesIds,
        },
      },
      sort: [{ _score: { order: 'desc' } }, { 'agreementInfo.postNr': 'asc' }, { 'agreementInfo.rank': 'asc' }],
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

export async function getProductsInPost(postIdentifier: string): Promise<SearchResponse> {
  const query = {
    bool: {
      must: [{ term: { 'agreementInfo.postIdentifier': { value: postIdentifier } } }],
    },
  }

  const res = await fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      size: 100,
      collapse: {
        field: 'seriesId',
      },
    }),
  })
  return res.json()
}

export type Suggestions = Array<{ text: string; data: ProductVariant }>
export type SuggestionsResponse = { suggestions: Suggestions }

//TODO: Bør denne returnere Product? Vet ikke om vi trenger det
export const fetchSuggestions = (term: string): Promise<SuggestionsResponse> => {
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
            size: 200,
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
      return { suggestions }
    })
}
