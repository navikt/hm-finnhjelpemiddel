import { CheckboxFilterInput } from '@/components/filters/CheckboxFilterInput'
import { RangeFilterInput } from '@/components/filters/RangeFilterInput'
import { FilterData } from '@/utils/api-util'
import { mapProductSearchParams } from '@/utils/product-util'
import { BodyShort, Heading, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const FilterView = ({ filters }: { filters?: FilterData }) => {
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapProductSearchParams(searchParams), [searchParams])

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const noAvailableFilters =
    !filters || !Object.values(filters).filter((data) => data.values.length).length || !Object.keys(filters).length

  if (!searchDataFilters.length && noAvailableFilters) {
    return (
      <div className="search__filters">
        <BodyShort>Ingen filtre tilgjengelig</BodyShort>
      </div>
    )
  }

  return (
    <VStack>
      <Heading size="small" level="2">
        Filter
      </Heading>
      <div className="search__filters">
        <CheckboxFilterInput filter={{ key: 'rammeavtale', data: filters?.rammeavtale }} />
        <CheckboxFilterInput filter={{ key: 'produktkategori', data: filters?.produktkategori }} />
        <RangeFilterInput variant="min" filter={{ key: 'setebreddeMinCM', data: filters?.setebreddeMinCM }} />
        <RangeFilterInput variant="max" filter={{ key: 'setebreddeMaksCM', data: filters?.setebreddeMaksCM }} />
        <RangeFilterInput variant="min" filter={{ key: 'setedybdeMinCM', data: filters?.setedybdeMinCM }} />
        <RangeFilterInput variant="max" filter={{ key: 'setedybdeMaksCM', data: filters?.setedybdeMaksCM }} />
        <RangeFilterInput variant="min" filter={{ key: 'setehoydeMinCM', data: filters?.setehoydeMinCM }} />
        <RangeFilterInput variant="max" filter={{ key: 'setehoydeMaksCM', data: filters?.setehoydeMaksCM }} />
        <RangeFilterInput variant="min" filter={{ key: 'brukervektMinKG', data: filters?.brukervektMinKG }} />
        <RangeFilterInput variant="max" filter={{ key: 'brukervektMaksKG', data: filters?.brukervektMaksKG }} />
        <RangeFilterInput filter={{ key: 'lengdeCM', data: filters?.lengdeCM }} />
        <RangeFilterInput filter={{ key: 'breddeCM', data: filters?.breddeCM }} />
        <RangeFilterInput filter={{ key: 'totalVektKG', data: filters?.totalVektKG }} />
        <CheckboxFilterInput filter={{ key: 'beregnetBarn', data: filters?.beregnetBarn }} />
        <CheckboxFilterInput filter={{ key: 'fyllmateriale', data: filters?.fyllmateriale }} />
        <CheckboxFilterInput filter={{ key: 'materialeTrekk', data: filters?.materialeTrekk }} />
        <CheckboxFilterInput filter={{ key: 'leverandor', data: filters?.leverandor }} />
      </div>
    </VStack>
  )
}

export default FilterView
