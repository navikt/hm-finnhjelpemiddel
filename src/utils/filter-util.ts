import { Filter, FilterCategoryKeyServer } from './api-util'
import { categories, getIsoCategoryBasedOnProductCategory } from './category-util'

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
  categories: [] as string[],
}
const visFilterLabels = [
  'På avtale med Nav',
  'På bestillingsordning',
  'På digital behovsmelding',
  'Skjul utgåtte hjelpemidler',
  'Skjul reservedeler og tilbehør',
]

export type FilterFormState = typeof initialFiltersFormState
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

export const categoryFilters: Filter = {
  values: categories.map((filterLabel) => ({
    key: filterLabel.name,
    doc_count: 1,
    label: filterLabel.name,
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

export const filterProduktkategoriISO = (values: Array<string>) => ({
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

export const filterMainProductsOnly = () => ({
  bool: {
    should: { term: { main: true } },
  },
})

export const filterNotExpiredOnly = () => ({
  bool: {
    should: {
      range: {
        expired: {
          gte: 'now',
        },
      },
    },
  },
})

export const filterPrefixIsoKode = (values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({
      prefix: { isoCategory: value },
    })),
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
      if (filterKey === 'På avtale med Nav') {
        return {
          match: { hasAgreement: 'true' },
        }
      }
    })
    .filter(Boolean)

  if (values.includes('Skjul reservedeler og tilbehør')) {
    filters.push({
      term: { main: true },
    })
  }

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

export const filterCategory = (values: Array<string>) => {
  const shouldList = values.flatMap<any>((value) => {
    if (value === 'Barn og unge') {
      return [{ term: { 'filters.beregnetBarn': 'JA' } }]
    } else {
      return getIsoCategoryBasedOnProductCategory(value).map((prefix) => ({
        prefix: { isoCategory: prefix },
      }))
    }
  })

  return {
    bool: {
      should: shouldList,
    },
  }
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

export const mapFilters = (filters: FilterFormState) =>
  Object.entries(filters)
    .filter(([_, value]) => value.length)
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {} as Record<string, string | string[]>
    )
