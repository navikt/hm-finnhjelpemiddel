import { CheckboxFilterInput } from '@/components/filters/CheckboxFilterInput'
import FilterMinMaxGroup, { MinMaxGroupFilter } from '@/components/filters/FilterMinMaxGroup'
import { FilterCategoryKeyServer, FilterData } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/product-util'
import { BodyShort, Heading, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

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
    .filter(([_, values]) => values.some((value) => value != null && value != ''))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const searchDataNewFilters = Object.entries(searchData.newFilters)
    .filter(([_, value]) => value.length)
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const searchDataNewAndOldFilters = searchDataFilters.concat(searchDataNewFilters)

  const noAvailableFilters =
    !filters || !Object.values(filters).filter((data) => data.values.length).length || !Object.keys(filters).length

  if (!searchDataFilters.length && noAvailableFilters) {
    return (
      <div className="filter-container__filters">
        <BodyShort>Ingen filtre tilgjengelig</BodyShort>
      </div>
    )
  }

  //Filrer bort alle andre filtre enn setefiltre
  const setedimensjonerFilters = filters
    ? Array.from(
        Object.keys(filters)
          .concat(searchDataNewAndOldFilters)
          .reduce((acc, filterKeyStr) => {
            const filterKey = filterKeyStr as FilterCategoryKeyServer
            const filter = minMaxFilterKeyMapSete['setedimensjoner'].find(
              (f) => f.min === filterKey || f.max === filterKey
            )
            if (filter) acc.set(filter.name, filter)
            return acc
          }, new Map<string, MinMaxGroupFilter>())
          .values()
      )
    : []

  //Filrer bort alle andre filtre enn målOgVekt (har ikke egne min og max filtre, kun to felter per filter)
  const målOgVektFilters = filters
    ? Array.from(
        Object.keys(filters)
          .concat(searchDataNewAndOldFilters)
          .reduce((acc, filterKeyStr) => {
            const filterKey = filterKeyStr as FilterCategoryKeyServer
            const filter = minMaxFilterKeyMapMålOgVekt['målOgVekt'].find(
              (f) => f.filterNameServer === filterKey || f.min === filterKey || f.max === filterKey
            )
            if (filter) acc.set(filter.name, filter)
            return acc
          }, new Map<string, MinMaxGroupFilter>())
          .values()
      )
    : []

  return (
    <VStack>
      <Heading size="small" level="2">
        Filter
      </Heading>
      <VStack gap="2" className="filter-container__filters">
        <CheckboxFilterInput filter={{ key: 'rammeavtale', data: filters?.rammeavtale }} />
        <CheckboxFilterInput filter={{ key: 'produktkategori', data: filters?.produktkategori }} />
        {setedimensjonerFilters.length > 0 && (
          <FilterMinMaxGroup groupTitle="Setedimensjoner" filters={setedimensjonerFilters} />
        )}

        {målOgVektFilters.length > 0 && <FilterMinMaxGroup groupTitle="Mål og vekt" filters={målOgVektFilters} />}

        <CheckboxFilterInput filter={{ key: 'delkontrakt', data: filters?.delkontrakt }} />
        <CheckboxFilterInput filter={{ key: 'beregnetBarn', data: filters?.beregnetBarn }} />
        <CheckboxFilterInput filter={{ key: 'fyllmateriale', data: filters?.fyllmateriale }} />
        <CheckboxFilterInput filter={{ key: 'materialeTrekk', data: filters?.materialeTrekk }} />
        <CheckboxFilterInput filter={{ key: 'leverandor', data: filters?.leverandor }} />
      </VStack>
    </VStack>
  )
}

export default FilterView
