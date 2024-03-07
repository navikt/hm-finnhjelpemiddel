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

  if (!min && !max) return { bool: { should: [] } }

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

export const filterMinSetebredde = (valueStr?: string) => {
  return mapRangeFilter('setebreddeMinCM', [valueStr ? +valueStr : null, null])
}

export const filterMaksSetebredde = (valueStr?: string) => {
  return mapRangeFilter('setebreddeMaksCM', [null, valueStr ? +valueStr : null])
}

export const filterMinSetedybde = (valueStr?: string) => {
  return mapRangeFilter('setedybdeMinCM', [valueStr ? +valueStr : null, null])
}

export const filterMaksSetedybde = (valueStr?: string) => {
  return mapRangeFilter('setedybdeMaksCM', [null, valueStr ? +valueStr : null])
}

export const filterMinSetehoyde = (valueStr?: string) => {
  return mapRangeFilter('setehoydeMinCM', [valueStr ? +valueStr : null, null])
}

export const filterMaksSetehoyde = (valueStr?: string) => {
  return mapRangeFilter('setehoydeMaksCM', [null, valueStr ? +valueStr : null])
}

export const filterMinBrukervekt = (valueStr?: string) => {
  return mapRangeFilter('brukervektMinKG', [valueStr ? +valueStr : null, null])
}

export const filterMaksBrukervekt = (valueStr?: string) => {
  return mapRangeFilter('brukervektMaksKG', [null, valueStr ? +valueStr : null])
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
