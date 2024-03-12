import FilterMinMaxGroup, { MinMaxGroupFilter } from '@/components/filters/RangeFilter'
import { FilterCategoryKeyServer } from '@/utils/api-util'
import { FilterData } from '@/utils/api-util'
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
    !filters || !Object.values(filters).filter((data) => data.values.length).length || !Object.keys(filters).length

  if (!searchDataFilters.length && noAvailableFilters) {
    return (
      <div className="filter-container__filters">
        <BodyShort>Ingen filtre tilgjengelig</BodyShort>
      </div>
    )
  }

  const getAvailableAndSelectedFiltersSetedimensjoner = (): Map<string, MinMaxGroupFilter> => {
    const selectedFiltersSetedimensjoner: Map<string, MinMaxGroupFilter> = new Map()

    searchDataFilters.forEach((filterKeyStr) => {
      const filter = minMaxFilterKeyMapSete['setedimensjoner'].find(
        (f) => f.min === filterKeyStr || f.max === filterKeyStr
      )
      if (filter) selectedFiltersSetedimensjoner.set(filter.name, filter)
    })

    filters &&
      Object.entries(filters).forEach(([filterKeyStr, filterValue]) => {
        const filterKey = filterKeyStr as FilterCategoryKeyServer
        const filter = minMaxFilterKeyMapSete['setedimensjoner'].find((f) => f.min === filterKey || f.max === filterKey)
        const isEmpty = filterValue.min === null && filterValue.max === null
        if (filter && !isEmpty) selectedFiltersSetedimensjoner.set(filter.name, filter)
      })

    return selectedFiltersSetedimensjoner
  }

  const getAvailableAndSelectedFiltersMålOgVekt = (): Map<string, MinMaxGroupFilter> => {
    const selectedFiltersMålOgVekt: Map<string, MinMaxGroupFilter> = new Map()

    searchDataFilters.forEach((filterKeyStr) => {
      const filter = minMaxFilterKeyMapMålOgVekt['målOgVekt'].find(
        (f) => f.filterNameServer === filterKeyStr || f.min === filterKeyStr || f.max === filterKeyStr
      )
      if (filter) selectedFiltersMålOgVekt.set(filter.name, filter)
    })

    filters &&
      Object.entries(filters).forEach(([filterKeyStr, filterValue]) => {
        const filterKey = filterKeyStr as FilterCategoryKeyServer
        const filter = minMaxFilterKeyMapMålOgVekt['målOgVekt'].find(
          (f) => f.filterNameServer === filterKey || f.min === filterKey || f.max === filterKey
        )
        const isEmpty = filterValue.min === null && filterValue.max === null
        if (filter && !isEmpty) selectedFiltersMålOgVekt.set(filter.name, filter)
      })

    return selectedFiltersMålOgVekt
  }

  const availableAndSelectedFiltersSetedimensjoner = getAvailableAndSelectedFiltersSetedimensjoner()
  const availableAndSelectedFiltersMålOgVekt = getAvailableAndSelectedFiltersMålOgVekt()

  console.log(availableAndSelectedFiltersMålOgVekt)

  return (
    <VStack>
      <Heading size="small" level="2">
        Filter
      </Heading>
      <VStack gap="2" className="filter-container__filters">
        <CheckboxFilter filter={{ key: 'produktkategori', data: filters?.produktkategori }} showSearch={true} />
        <CheckboxFilter filter={{ key: 'rammeavtale', data: filters?.rammeavtale }} showSearch={true} />
        {availableAndSelectedFiltersSetedimensjoner.size > 0 && (
          <FilterMinMaxGroup
            groupTitle="Setedimensjoner"
            filters={Array.from(availableAndSelectedFiltersSetedimensjoner.values())}
          />
        )}
        {availableAndSelectedFiltersMålOgVekt.size > 0 && (
          <FilterMinMaxGroup
            groupTitle="Mål og vekt"
            filters={Array.from(availableAndSelectedFiltersMålOgVekt.values())}
          />
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
