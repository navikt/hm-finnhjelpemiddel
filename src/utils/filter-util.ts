import { FilterCategoryKeyServer } from './api-util'

//TODO: Legge denn inn i NewFilterState med riktig type og slette denne. Rename newFilterStatetilFilterState.
export const initialFiltersState = {
  beregnetBarn: [],
  fyllmateriale: [],
  materialeTrekk: [],
  leverandor: [],
  produktkategori: [],
  rammeavtale: [],
  delkontrakt: [],
}

export const initialNewFiltersFormState = {
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
}

export type NewFiltersFormState = typeof initialNewFiltersFormState
export type NewFiltersFormKey = keyof NewFiltersFormState

//Egentlig så trengs ikke denne lenger. Fordi vi skal ikke ha strengene som labels.
export enum FilterCategories {
  fyllmateriale = 'Fyllmateriale',
  materialeTrekk = 'Trekkmateriale',
  beregnetBarn = 'Beregnet på barn',
  leverandor = 'Leverandør',
  produktkategori = 'Produktkategori',
  rammeavtale = 'Rammeavtale',
  delkontrakt = 'Delkontrakt',
}

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

// const mapNewRangeFilter = (
//   keyMin: FilterCategoryKeyServer,
//   keyMax: FilterCategoryKeyServer,
//   minValue: Array<any>,
//   maxValue: Array<any>
// ) => {
//   const [min1, max1] = minValue
//   const [min2, max2] = maxValue

//   // if (!min1 && !max1) return { bool: { should: [] } }

//   return {
//     bool: {
//       should: [
//         {
//           range: {
//             [`filters.${keyMin}`]: {
//               gte: min1 || undefined,
//               lte: max1 || undefined,
//             },
//           },
//         },
//         {
//           range: {
//             [`filters.${keyMax}`]: {
//               gte: min2 || undefined,
//               lte: max2 || undefined,
//             },
//           },
//         },
//       ],
//     },
//   }
// }

// export const filterSeteHøyde = (seteHoydeMin?: number, seteHoydeMaks?: number) => {
//   return mapNewRangeFilter('setehoydeMinCM', 'setehoydeMaksCM', [seteHoydeMin, null], [null, seteHoydeMaks])
// }

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

export const filterFyllmateriale = (values: Array<number>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'filters.fyllmateriale': value } })),
  },
})

export const filterMaterialeTrekk = (values: Array<number>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'filters.materialeTrekk': value } })),
  },
})

export const filterLeverandor = (values: Array<string>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'supplier.name': value } })),
  },
})

export const filterProduktkategori = (values: Array<number>) => ({
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
