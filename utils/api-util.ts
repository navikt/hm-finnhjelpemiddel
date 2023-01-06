import { FilterCategories } from '../app/FilterView'
import { mapProducts, Product } from './product-util'
import {
  filterBredde,
  filterLengde,
  filterMaksBrukervekt,
  filterMaksSetebredde,
  filterMaksSetedybde,
  filterMaksSetehoyde,
  filterMinBrukervekt,
  filterMinSetebredde,
  filterMinSetedybde,
  filterMinSetehoyde,
  filterTotalvekt,
} from './filter-util'

export const PAGE_SIZE = 15

export type SelectedFilters = Record<keyof typeof FilterCategories, Array<any>>
export type Bucket = { key: number | string; doc_count: number }

export type FilterData = {
  [key in FilterCategories]: {
    buckets?: Array<Bucket>
    values?: { sum_other_doc_count?: number; buckets?: Array<Bucket> }
    sum_other_doc_count?: number
  }
}

export type SearchData = { searchTerm: string; isoCode: string; hasRammeavtale: boolean; filters: SelectedFilters }

type FetchProps = {
  url: string
  pageIndex: number
  searchData: SearchData
}

export type FetchResponse = {
  numberOfProducts: number
  products: Product[]
  filters: FilterData
}

export const fetchProducts = ({ url, pageIndex, searchData }: FetchProps): Promise<FetchResponse> => {
  const from = pageIndex * PAGE_SIZE
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
  } = filters

  const query = {
    bool: {
      must: {
        bool: {
          should: [
            {
              multi_match: {
                query: searchTerm,
                type: 'cross_fields',
                fields: ['title^3', 'description.text^2', '*'],
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
      filter: [
        isoCode && {
          match_bool_prefix: {
            isoCategory: isoCode,
          },
        },
        {
          match_bool_prefix: {
            hasAgreement: hasRammeavtale,
          },
        },
      ],
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
      size: PAGE_SIZE,
      query,
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.lengdeCM' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.breddeCM' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.totalVektKG' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.setebreddeMinCM' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.setebreddeMaksCM' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.setedybdeMinCM' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.setedybdeMaksCM' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.setehoydeMinCM' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.setehoydeMaksCM' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.brukervektMinKG' } },
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
              ],
            },
          },
          aggs: {
            values: { terms: { field: 'filters.brukervektMaksKG' } },
          },
        },
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const products: Product[] = mapProducts(data)
      return { numberOfProducts: data.hits.total.value, products, filters: data.aggregations }
    })
}

export async function getProduct(id: string) {
  const res = await fetch(`https://grunndata-search.dev-gcp.nais.io/product/_doc/${id}`, {
    method: 'GET',
  })

  return res.json()
}

export async function getSupplier(id: string) {
  const res = await fetch(`https://grunndata-search.dev-gcp.nais.io/supplier/_doc/${id}`, {
    method: 'GET',
  })

  return res.json()
}

export async function getSeries(seriesId: string) {
  const query = {
    bool: {
      must: [{ term: { 'seriesId.keyword': seriesId } }, { exists: { field: 'data' } }],
    },
  }

  const res = await fetch('https://grunndata-search.dev-gcp.nais.io/product/_search', {
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
