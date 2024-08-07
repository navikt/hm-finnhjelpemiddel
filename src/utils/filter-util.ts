import { Filter, FilterCategoryKeyServer } from './api-util'

export const initialFiltersFormState = {
  setebreddeMaksCM: '',
  setebreddeMinCM: '',
  setedybdeMaksCM: '',
  setehoydeMaksCM: '',
  setehoydeMinCM: '',
  setedybdeMinCM: '',
  totalVektMinKG: '',
  totalVektMaxKG: '',
  lengdeMinCM: '',
  lengdeMaxCM: '',
  breddeMinCM: '',
  breddeMaxCM: '',
  brukervektMinKG: '',
  brukervektMaksKG: '',
  beregnetBarn: [] as string[],
  fyllmateriale: [] as string[],
  materialeTrekk: [] as string[],
  leverandor: [] as string[],
  produktkategori: [] as string[],
  rammeavtale: [] as string[],
  delkontrakt: [] as string[],
  vis: [] as string[],
  status: [] as string[],
}

export const filtersFormStateLabel = {
  setebreddeMaksCM: 'Setebredde maks',
  setebreddeMinCM: 'Setebredde min',
  setedybdeMaksCM: 'Setedybde maks',
  setehoydeMaksCM: 'Setehøyde maks',
  setehoydeMinCM: 'Setehøyde min',
  setedybdeMinCM: 'Setedybde min',
  totalVektMinKG: 'Totalvekt min',
  totalVektMaxKG: 'Totalvekt maks',
  lengdeMinCM: 'Lengde min',
  lengdeMaxCM: 'Lengde maks',
  breddeMinCM: 'Bredde min',
  breddeMaxCM: 'Bredde maks',
  brukervektMinKG: 'Brukervekt min',
  brukervektMaksKG: 'Brukervekt maks',
  beregnetBarn: 'Beregnet på barn',
  fyllmateriale: 'Fyllmateriale',
  materialeTrekk: 'Trekkmateriale',
  leverandor: 'Leverandør',
  produktkategori: 'Produktkategori',
  rammeavtale: 'Rammeavtale',
  delkontrakt: 'Delkontrakt',
  vis: 'Vis',
  status: 'Status',
}

const visFilterLabels = [
  'På avtale med NAV',
  'På bestillingsordning',
  'På digital behovsmelding',
  'Skjul utgåtte hjelpemidler',
]

export type FilterFormState = typeof initialFiltersFormState
export type FilterFormKey = keyof FilterFormState

type MinMaxFilter =
  | { setebreddeMinCM?: string }
  | { setebreddeMaksCM?: string }
  | { setedybdeMinCM?: string }
  | { setedybdeMaksCM?: string }
  | { setehoydeMinCM?: string }
  | { setehoydeMaksCM?: string }
  | { brukervektMinKG?: string }
  | { brukervektMaksKG?: string }

export const filterMinMax = (min: MinMaxFilter, max: MinMaxFilter, isHmsSuggestion?: boolean) => {
  const keyMin = Object.keys(min)[0]
  const valueMin = Object.values(min)[0]
  const keyMax = Object.keys(max)[0]
  const valueMax = Object.values(max)[0]

  if (!valueMin?.length && !valueMax?.length) return null

  const mustClausesMin: any[] = []
  const mustClausesMax: any[] = []
  if (valueMin !== '') {
    mustClausesMax.push({
      range: {
        [`filters.${keyMax}`]: {
          gte: Number(valueMin),
        },
      },
    })
  }

  if (valueMax !== '') {
    mustClausesMin.push({
      range: {
        [`filters.${keyMin}`]: {
          lte: isHmsSuggestion ? Number(valueMax) + 3 : Number(valueMax),
        },
      },
    })
  }

  return {
    bool: {
      must: mustClausesMax.concat(mustClausesMin),
    },
  }
}

export const visFilters: Filter = {
  values: visFilterLabels.map((filterLabel) => ({
    key: filterLabel,
    doc_count: 1,
    label: filterLabel,
  })),
}

const mapRangeFilter = (key: FilterCategoryKeyServer, values: Array<any>) => {
  const [min, max] = values

  if (!min && !max) return null

  return {
    bool: {
      should: {
        range: {
          [`filters.${key}`]: {
            gte: min || undefined,
            lte: max || undefined,
          },
        },
      },
    },
  }
}

export const filterLengde = (minStr?: string, maxStr?: string) => {
  return mapRangeFilter('lengdeCM', [minStr ? +minStr : null, maxStr ? +maxStr : null])
}

export const filterBredde = (minStr?: string, maxStr?: string) => {
  return mapRangeFilter('breddeCM', [minStr ? +minStr : null, maxStr ? +maxStr : null])
}

export const filterTotalvekt = (minStr?: string, maxStr?: string) => {
  return mapRangeFilter('totalVektKG', [minStr ? +minStr : null, maxStr ? +maxStr : null])
}

export const filterBeregnetBarn = (values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'filters.beregnetBarn': value } })),
  },
})

export const filterFyllmateriale = (values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'filters.fyllmateriale': value } })),
  },
})

export const filterMaterialeTrekk = (values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'filters.materialeTrekk': value } })),
  },
})

export const filterLeverandor = (values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'supplier.name': value } })),
  },
})

export const filterProduktkategori = (values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({ term: { isoCategoryName: value } })),
  },
})

export const filterRammeavtale = (values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'agreements.label': value } })),
  },
})

export const filterDelkontrakt = (values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'agreements.postTitle': value } })),
  },
})

export const filterVis = (values: Array<string>) => {
  const filters: any[] = values
    .map((filterKey) => {
      if (filterKey === 'På digital behovsmelding') {
        return {
          term: { 'attributes.digitalSoknad': 'true' },
        }
      }
      if (filterKey === 'På bestillingsordning') {
        return {
          term: { 'attributes.bestillingsordning': 'true' },
        }
      }
      if (filterKey === 'På avtale med NAV') {
        return {
          match: { hasAgreement: 'true' },
        }
      }
    })
    .filter(Boolean)

  if (values.includes('Skjul utgåtte hjelpemidler')) {
    filters.push({
      term: {
        status: {
          value: 'ACTIVE',
        },
      },
    })
  } else {
    filters.push({
      terms: {
        status: ['ACTIVE', 'INACTIVE'],
      },
    })
  }


  return filters
}

export const filterStatus = (values: Array<string>) => {
  const filterKey = values[0]
  if (filterKey === 'På avtale') {
    return {
      match: { hasAgreement: 'true' },
    }
  }
  if (filterKey === 'Ikke på avtale') {
    return {
      match: { hasAgreement: 'false' },
    }
  }
  if (filterKey === 'Utgått') {
    return {
      term: { status: 'INACTIVE' },
    }
  }

  return null
}

export const toMinMaxAggs = (filterKey: string) => ({
  values: { terms: { field: filterKey } },
  min: {
    min: {
      field: filterKey,
    },
  },
  max: {
    max: {
      field: filterKey,
    },
  },
})
