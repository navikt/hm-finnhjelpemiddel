import FilterMinMaxGroup from '@/components/filters/RangeFilter'
import { FilterData } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { BodyShort, HStack, Heading, HelpText } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { CheckboxFilter } from './CheckboxFilter'
import { ChipsFilter } from './ChipsFilter'
import { getAvailableAndSelectedFiltersMålOgVekt, getAvailableAndSelectedFiltersSetedimensjoner } from './FilterView'

export const FilterViewProductPage = ({ filters }: { filters?: FilterData }) => {
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
    <>
      <HStack gap="2">
        <Heading size="small" level="2">
          Filtrer tabell
        </Heading>
        <HelpText placement="right" strategy="absolute">
          Vi jobber kontinuerlig med å forbedre og tilgjengeliggjøre flere filtre. Det er kun de som vises her som er
          tilgjengelig for dette hjelpemiddelet per i dag.
        </HelpText>
      </HStack>

      <HStack gap="2" className="filter-container__filters filter-container__horizontal spacing-bottom--medium">
        {availableAndSelectedFiltersSetedimensjoner.length > 0 && (
          <FilterMinMaxGroup groupTitle="Setedimensjoner" filters={availableAndSelectedFiltersSetedimensjoner} />
        )}
        {availableAndSelectedFiltersMålOgVekt.length > 0 && (
          <FilterMinMaxGroup groupTitle="Mål og vekt" filters={availableAndSelectedFiltersMålOgVekt} />
        )}
        {(filters?.beregnetBarn?.values?.length ?? 0) > 1 && (
          <CheckboxFilter filter={{ key: 'beregnetBarn', data: filters?.beregnetBarn }} />
        )}
        {(filters?.fyllmateriale?.values?.length ?? 0) > 1 && (
          <CheckboxFilter filter={{ key: 'fyllmateriale', data: filters?.fyllmateriale }} showSearch={true} />
        )}
        {(filters?.materialeTrekk?.values?.length ?? 0) > 1 && (
          <CheckboxFilter filter={{ key: 'materialeTrekk', data: filters?.materialeTrekk }} showSearch={true} />
        )}
      </HStack>

      {filters?.status && <ChipsFilter filterKey="status" filter={filters?.status} />}
    </>
  )
}
