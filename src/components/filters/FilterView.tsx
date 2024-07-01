import FilterMinMaxGroup, { MinMaxGroupFilter } from '@/components/filters/RangeFilter'
import { FilterCategoryKeyServer, FilterData } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { BodyShort, Heading, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { CheckboxFilter } from './CheckboxFilter'

const minMaxFilterKeyMapSete: Record<'setedimensjoner', MinMaxGroupFilter[]> = {
  setedimensjoner: [
    {
      name: 'Bredde',
      min: 'setebreddeMinCM',
      max: 'setebreddeMaksCM',
    },
    {
      name: 'Høyde',
      min: 'setehoydeMinCM',
      max: 'setehoydeMaksCM',
    },
    {
      name: 'Dybde',
      min: 'setedybdeMinCM',
      max: 'setedybdeMaksCM',
    },
  ],
}

const minMaxFilterKeyMapMålOgVekt: Record<'målOgVekt', MinMaxGroupFilter[]> = {
  målOgVekt: [
    {
      name: 'Lengde',
      filterNameServer: 'lengdeCM',
      min: 'lengdeMinCM',
      max: 'lengdeMaxCM',
    },
    {
      name: 'Bredde',
      filterNameServer: 'breddeCM',
      min: 'breddeMinCM',
      max: 'breddeMaxCM',
    },
    {
      name: 'Totalvekt',
      filterNameServer: 'totalVektKG',
      min: 'totalVektMinKG',
      max: 'totalVektMaxKG',
    },
    {
      name: 'Brukervekt',
      min: 'brukervektMinKG',
      max: 'brukervektMaksKG',
    },
  ],
}

const FilterView = ({ filters }: { filters?: FilterData }) => {
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, value]) => value.length)
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const noAvailableFilters =
    !filters || !Object.values(filters).filter((data) => data.values?.length).length || !Object.keys(filters).length

  if (!searchDataFilters.length && noAvailableFilters) {
    return (
      <div className="filter-container__filters">
        <BodyShort>Ingen filtre tilgjengelig</BodyShort>
      </div>
    )
  }

  const availableAndSelectedFiltersSetedimensjoner = getAvailableAndSelectedFiltersSetedimensjoner(
    searchDataFilters,
    filters
  )
  const availableAndSelectedFiltersMålOgVekt = getAvailableAndSelectedFiltersMålOgVekt(searchDataFilters, filters)

  return (
    <VStack>
      <Heading size="small" level="2">
        Filter
      </Heading>
      <VStack gap="2" className="filter-container__filters">
        <CheckboxFilter filter={{ key: 'vis', data: filters?.vis }} openByDefault={true}></CheckboxFilter>
        <CheckboxFilter filter={{ key: 'vis', data: filters?. }} openByDefault={true}></CheckboxFilter>
        <CheckboxFilter filter={{ key: 'produktkategori', data: filters?.produktkategori }} showSearch={true} />
        <CheckboxFilter filter={{ key: 'rammeavtale', data: filters?.rammeavtale }} showSearch={true} />
        {availableAndSelectedFiltersSetedimensjoner.length > 0 && (
          <FilterMinMaxGroup groupTitle="Setedimensjoner" filters={availableAndSelectedFiltersSetedimensjoner} />
        )}
        {availableAndSelectedFiltersMålOgVekt.length > 0 && (
          <FilterMinMaxGroup groupTitle="Mål og vekt" filters={availableAndSelectedFiltersMålOgVekt} />
        )}
        <CheckboxFilter filter={{ key: 'delkontrakt', data: filters?.delkontrakt }} />
        <CheckboxFilter filter={{ key: 'beregnetBarn', data: filters?.beregnetBarn }} />
        <CheckboxFilter filter={{ key: 'fyllmateriale', data: filters?.fyllmateriale }} showSearch={true} />
        <CheckboxFilter filter={{ key: 'materialeTrekk', data: filters?.materialeTrekk }} showSearch={true} />
        <CheckboxFilter filter={{ key: 'leverandor', data: filters?.leverandor }} showSearch={true} />
      </VStack>
    </VStack>
  )
}

export default FilterView

export const getAvailableAndSelectedFiltersSetedimensjoner = (
  searchDataFilters: string[],
  filtersFromServer?: FilterData
): MinMaxGroupFilter[] => {
  const selectedFiltersSetedimensjoner: Map<string, MinMaxGroupFilter> = new Map()

  searchDataFilters.forEach((filterKeyStr) => {
    const filter = minMaxFilterKeyMapSete['setedimensjoner'].find(
      (f) => f.min === filterKeyStr || f.max === filterKeyStr
    )
    if (filter) selectedFiltersSetedimensjoner.set(filter.name, filter)
  })

  filtersFromServer &&
    Object.entries(filtersFromServer).forEach(([filterKeyStr, filterValue]) => {
      const filterKey = filterKeyStr as FilterCategoryKeyServer
      const filter = minMaxFilterKeyMapSete['setedimensjoner'].find((f) => f.min === filterKey || f.max === filterKey)
      const isEmpty = filterValue.min === null && filterValue.max === null
      const onlyOneValue = filterValue.values.length === 1
      if (filter && !isEmpty && !onlyOneValue) selectedFiltersSetedimensjoner.set(filter.name, filter)
    })
  const validFiltersArray = Array.from(selectedFiltersSetedimensjoner.values())

  validFiltersArray.sort((a, b) => a.name.localeCompare(b.name))

  return validFiltersArray
}

export const getAvailableAndSelectedFiltersMålOgVekt = (
  searchDataFilters: string[],
  filtersFromServer?: FilterData
): MinMaxGroupFilter[] => {
  const selectedFiltersMålOgVekt: Map<string, MinMaxGroupFilter> = new Map()

  searchDataFilters.forEach((filterKeyStr) => {
    const filter = minMaxFilterKeyMapMålOgVekt['målOgVekt'].find(
      (f) => f.filterNameServer === filterKeyStr || f.min === filterKeyStr || f.max === filterKeyStr
    )
    if (filter) selectedFiltersMålOgVekt.set(filter.name, filter)
  })

  filtersFromServer &&
    Object.entries(filtersFromServer).forEach(([filterKeyStr, filterValue]) => {
      const filterKey = filterKeyStr as FilterCategoryKeyServer
      const filter = minMaxFilterKeyMapMålOgVekt['målOgVekt'].find(
        (f) => f.filterNameServer === filterKey || f.min === filterKey || f.max === filterKey
      )
      const isEmpty = filterValue.min === null && filterValue.max === null
      const onlyOneValue = filterValue.values.length === 1
      if (filter && !isEmpty && !onlyOneValue) selectedFiltersMålOgVekt.set(filter.name, filter)
    })

  const validFiltersArray = Array.from(selectedFiltersMålOgVekt.values())

  const order = ['Lengde', 'Bredde', 'Totalvekt', 'Brukervekt']
  validFiltersArray.sort((a, b) => {
    const indexA = order.indexOf(a.name)
    const indexB = order.indexOf(b.name)

    return (indexA === -1 ? order.length : indexA) - (indexB === -1 ? order.length : indexB)
  })

  return validFiltersArray
}
