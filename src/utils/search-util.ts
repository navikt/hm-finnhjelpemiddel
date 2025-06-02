import {
  filterBeregnetBarn,
  filterBredde,
  filterCategory,
  filterFyllmateriale,
  filterLengde,
  filterLeverandor,
  filterMaterialeTrekk,
  filterMinMax,
  filterProduktkategoriISO,
  filterRammeavtale,
  filterStatus,
  filterTotalvekt,
  filterVis,
  toMinMaxAggs,
} from '@/utils/filter-util'
import { mapProductFromSeriesId, mapProductsFromCollapse, Product } from '@/utils/product-util'
import { FilterCategoryKeyServer, FilterData, makeSearchTermQuery, mapFilters } from '@/utils/api-util'
import { SearchData } from '@/utils/search-state-util'

//if HM_SEARCH_URL is undefined it means that we are on the client and we want to use relative url
const HM_SEARCH_URL = process.env.HM_SEARCH_URL || ''

const sortOptionsOpenSearch = {
  Delkontrakt_rangering: [{ 'agreements.postNr': 'asc' }, { 'agreements.rank': 'asc' }],
  Best_soketreff: [{ _score: { order: 'desc' } }],
}

type FetchProductsProps = {
  from: number
  size: number
  searchData: SearchData
  dontCollapse?: boolean
  seriesId?: string
}

type SearchQueryBody = {
  from: number
  size: number
  track_scores: boolean
  sort: any[]
  query: {}
  collapse?: {}
  post_filter: {}
  aggs: {}
}

export type SeriesSearchResults = {
  products: Product[]
  filters: FilterData
  totalHits: number
}

export const fetchSeriesSearchResults = ({
  from,
  size,
  searchData,
  dontCollapse = false,
  seriesId,
}: FetchProductsProps): Promise<SeriesSearchResults> => {
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
    categories,
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
    produktkategori: filterProduktkategoriISO(produktkategori),
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

  const body: SearchQueryBody = {
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
          filterProduktkategoriISO(produktkategori),
          filterRammeavtale(rammeavtale),
          ...filterVis(vis),
          filterStatus(status),
          filterCategory(categories),
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
        totalHits: data.hits.total.value,
      }
    })
}
