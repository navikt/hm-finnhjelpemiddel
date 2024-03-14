import { FilterCategoryKeyServer } from './api-util'

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
}

export type FilterFormState = typeof initialFiltersFormState
export type FilterFormKey = keyof FilterFormState

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

type MinMaxFilter =
  | { setebreddeMinCM?: string }
  | { setebreddeMaksCM?: string }
  | { setedybdeMinCM?: string }
  | { setedybdeMaksCM?: string }
  | { setehoydeMinCM?: string }
  | { setehoydeMaksCM?: string }
  | { brukervektMinKG?: string }
  | { brukervektMaksKG?: string }

export const filterMinMax = (min: MinMaxFilter, max: MinMaxFilter) => {
  const keyMin = Object.keys(min)[0]
  const valueMin = Object.values(min)[0]
  const keyMax = Object.keys(max)[0]
  const valueMax = Object.values(max)[0]
  return {
    bool: {
      should: [
        {
          range: {
            [`filters.${keyMin}`]: {
              ...(valueMin && { gte: Number(valueMin) }),
              ...(valueMax && { lte: Number(valueMax) }),
            },
          },
        },
        {
          range: {
            [`filters.${keyMax}`]: {
              ...(valueMin && { gte: Number(valueMin) }),
              ...(valueMax && { lte: Number(valueMax) }),
            },
          },
        },
      ],
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
