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

//I openSearch er ikke setebreddeMin en range med min og max. er bare et number. Så det gir ingen mening å ha en range for et min-filter.
//Det er vi som har laget dette systemet. Jeg tenker at det kun gir mening å ha gte (større eller lik) dersom man velger min og lte (mindre enn) hvis det er max.
const mapMinOrMaxFilter = (type: 'min' | 'max', key: FilterCategoryKeyServer, value: number) => {
  return {
    bool: {
      should: [
        {
          range: {
            [`filters.${key}`]:
              type === 'min'
                ? {
                    gte: value,
                  }
                : {
                    lte: value,
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

export const filterMinSetebredde = (valueStr?: string) => {
  return valueStr ? mapMinOrMaxFilter('min', 'setebreddeMinCM', Number(valueStr)) : null
}

export const filterMaksSetebredde = (valueStr?: string) => {
  return valueStr ? mapMinOrMaxFilter('max', 'setebreddeMaksCM', Number(valueStr)) : null
}

export const filterMinSetedybde = (valueStr?: string) => {
  return valueStr ? mapMinOrMaxFilter('min', 'setedybdeMinCM', Number(valueStr)) : null
}

export const filterMaksSetedybde = (valueStr?: string) => {
  return valueStr ? mapMinOrMaxFilter('max', 'setedybdeMaksCM', Number(valueStr)) : null
}

export const filterMinBrukervekt = (valueStr?: string) => {
  return valueStr ? mapMinOrMaxFilter('min', 'brukervektMinKG', Number(valueStr)) : null
}

export const filterMaksBrukervekt = (valueStr?: string) => {
  return valueStr ? mapMinOrMaxFilter('max', 'brukervektMaksKG', Number(valueStr)) : null
}

export const filterMinSetehoyde = (valueStr?: string) => {
  return valueStr ? mapMinOrMaxFilter('min', 'setehoydeMinCM', Number(valueStr)) : null
}

export const filterMaksSetehoyde = (valueStr?: string) => {
  return valueStr ? mapMinOrMaxFilter('max', 'setehoydeMaksCM', Number(valueStr)) : null
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
