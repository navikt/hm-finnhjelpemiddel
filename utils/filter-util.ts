import { FilterCategories } from '../app/FilterView'

export const initialFiltersState = {
  beregnetBarn: [],
  breddeCM: [],
  brukervektMaksKG: [],
  brukervektMinKG: [],
  fyllmateriale: [],
  lengdeCM: [],
  materialeTrekk: [],
  setebreddeMaksCM: [],
  setebreddeMinCM: [],
  setedybdeMaksCM: [],
  setehoydeMaksCM: [],
  setehoydeMinCM: [],
  setedybdeMinCM: [],
  totalVektKG: [],
}

const mapRangeFilter = (key: keyof typeof FilterCategories, values: Array<number>) => {
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

export const filterLengde = (values: Array<number>) => {
  return mapRangeFilter('lengdeCM', values)
}

export const filterBredde = (values: Array<number>) => {
  return mapRangeFilter('breddeCM', values)
}

export const filterTotalvekt = (values: Array<number>) => {
  return mapRangeFilter('totalVektKG', values)
}

export const filterMinSetebredde = (values: Array<number>) => {
  return mapRangeFilter('setebreddeMinCM', values)
}

export const filterMaksSetebredde = (values: Array<number>) => {
  return mapRangeFilter('setebreddeMaksCM', values)
}

export const filterMinSetedybde = (values: Array<number>) => {
  return mapRangeFilter('setedybdeMinCM', values)
}

export const filterMaksSetedybde = (values: Array<number>) => {
  return mapRangeFilter('setedybdeMaksCM', values)
}

export const filterMinSetehoyde = (values: Array<number>) => {
  return mapRangeFilter('setehoydeMinCM', values)
}

export const filterMaksSetehoyde = (values: Array<number>) => {
  return mapRangeFilter('setehoydeMaksCM', values)
}

export const filterMinBrukervekt = (values: Array<number>) => {
  return mapRangeFilter('brukervektMinKG', values)
}

export const filterMaksBrukervekt = (values: Array<number>) => {
  return mapRangeFilter('brukervektMaksKG', values)
}

export const filterBeregnetBarn = (values: Array<number>) => ({
  bool: {
    should: values.map((value) => ({ term: { 'filters.beregnetBarn': value } })),
  },
})
