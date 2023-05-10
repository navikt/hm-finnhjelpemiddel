import React from 'react'
import { BodyShort, Heading } from '@navikt/ds-react'
import { FilterData } from '@/utils/api-util'
import { useHydratedSearchStore } from '@/utils/search-state-util'

import { CheckboxFilterInput } from './internals/CheckboxFilterInput'
import { RangeFilterInput } from './internals/RangeFilterInput'

const FilterView = ({ filters }: { filters?: FilterData }) => {
  const { searchData } = useHydratedSearchStore()
  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const noAvailableFilters =
    !filters || !Object.values(filters).filter((data) => data.values.length).length || !Object.keys(filters).length

  if (!searchDataFilters.length && noAvailableFilters) {
    return (
      <div className="search__filters">
        <Heading level="2" size="xsmall" spacing>
          Filtre
        </Heading>
        <BodyShort>Ingen filtre tilgjengelig</BodyShort>
      </div>
    )
  }

  return (
    <div className="search__filters">
      <Heading level="2" size="xsmall" spacing>
        Filtre
      </Heading>
      <RangeFilterInput filter={{ key: 'lengdeCM', data: filters?.lengdeCM }} />
      <RangeFilterInput filter={{ key: 'breddeCM', data: filters?.breddeCM }} />
      <RangeFilterInput variant="min" filter={{ key: 'setebreddeMinCM', data: filters?.setebreddeMinCM }} />
      <RangeFilterInput variant="max" filter={{ key: 'setebreddeMaksCM', data: filters?.setebreddeMaksCM }} />
      <RangeFilterInput variant="min" filter={{ key: 'setedybdeMinCM', data: filters?.setedybdeMinCM }} />
      <RangeFilterInput variant="max" filter={{ key: 'setedybdeMaksCM', data: filters?.setedybdeMaksCM }} />
      <RangeFilterInput variant="min" filter={{ key: 'setehoydeMinCM', data: filters?.setehoydeMinCM }} />
      <RangeFilterInput variant="max" filter={{ key: 'setehoydeMaksCM', data: filters?.setehoydeMaksCM }} />
      <RangeFilterInput variant="min" filter={{ key: 'brukervektMinKG', data: filters?.brukervektMinKG }} />
      <RangeFilterInput variant="max" filter={{ key: 'brukervektMaksKG', data: filters?.brukervektMaksKG }} />
      <RangeFilterInput filter={{ key: 'totalVektKG', data: filters?.totalVektKG }} />
      <CheckboxFilterInput filter={{ key: 'beregnetBarn', data: filters?.beregnetBarn }} />
      <CheckboxFilterInput filter={{ key: 'fyllmateriale', data: filters?.fyllmateriale }} />
      <CheckboxFilterInput filter={{ key: 'materialeTrekk', data: filters?.materialeTrekk }} />
    </div>
  )
}

export default FilterView
