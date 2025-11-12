import { filterMainProductsOnly } from '@/utils/filter-util'
import { SearchData } from '@/utils/search-state-util'
import { mapProductFromSeriesId, mapProductsFromCollapse, Product } from '@/utils/product-util'

type QueryObjectKategori = {
  from: number
  size: number
  track_scores: boolean
  sort: any[]
  query: {}
  collapse?: {}
  aggs: {}
}
type FetchProps = {
  from: number
  size: number
  searchData: SearchData
  dontCollapse?: boolean
  seriesId?: string
}

//if HM_SEARCH_URL is undefined it means that we are on the client and we want to use relative url
const HM_SEARCH_URL = process.env.HM_SEARCH_URL || ''
// ISO categories that must always be excluded / filtered out (e.g. from autocomplete) and optionally from general search
export const EXCLUDED_ISO_CATEGORIES = ['09540601', '09540901', '09540301']

const sortOptionsOpenSearch = {
  Delkontrakt_rangering: [{ 'agreements.postNr': 'asc' }, { 'agreements.rank': 'asc' }],
  Best_soketreff: [{ _score: { order: 'desc' } }],
  Rangering: [{ 'agreements.rank': 'asc' }],
}

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
    ...{
      must_not: {
        bool: {
          should: EXCLUDED_ISO_CATEGORIES.map((isoCategory) => ({ match: { isoCategory } })),
        },
      },
    },
  }
}

export const fetchProductsKategori = async ({
  from,
  size,
  searchData,
  dontCollapse = false,
  seriesId,
}: FetchProps): Promise<Product[]> => {
  const { isoCode, sortOrder } = searchData
  const sortOrderOpenSearch = sortOrder ? sortOptionsOpenSearch[sortOrder] : sortOptionsOpenSearch['Rangering']
  const searchTermQuery = makeSearchTermQueryKategori({ seriesId })
  const visTilbDeler = false

  const queryFilters: Array<any> = []

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

  const aggs = {}

  const body: QueryObjectKategori = {
    from,
    size,
    track_scores: true,
    sort: sortOrderOpenSearch,
    query,
    aggs,
  }

  if (!dontCollapse) {
    body.collapse = {
      field: 'seriesId',
    }
  }

  const res = await fetch(HM_SEARCH_URL + '/products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return dontCollapse
    ? data.hits.hits.length > 0
      ? new Array(mapProductFromSeriesId(data))
      : []
    : mapProductsFromCollapse(data)
}
