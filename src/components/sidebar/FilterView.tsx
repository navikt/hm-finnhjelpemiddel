import React from 'react'
import { BodyShort, Heading, Label } from '@navikt/ds-react'
import { FilterData } from '../../utils/api-util'
import { useHydratedSearchStore } from '../../utils/search-state-util'

import { RangeFilterInput } from './internals/RangeFilterInput'
import { CheckboxFilterInput } from './internals/CheckboxFilterInput'

const FilterView = ({ filters }: { filters?: FilterData }) => {
  const { searchData } = useHydratedSearchStore()
  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  if (!searchDataFilters.length && (!filters || !Object.keys(filters).length)) {
    return (
      <div className="search__filters">
        <Heading level="2" size="xsmall">
          Filtre
        </Heading>
        <BodyShort>Ingen filtre tilgjengelig</BodyShort>
      </div>
    )
  }

  return (
    <div className="search__filters">
      <Heading level="2" size="xsmall">
        Filtre
      </Heading>
      <RangeFilterInput filter={{ key: 'lengdeCM', data: filters?.lengdeCM }} />
      <RangeFilterInput filter={{ key: 'breddeCM', data: filters?.breddeCM }} />
      <RangeFilterInput filter={{ key: 'totalVektKG', data: filters?.totalVektKG }} />
      <RangeFilterInput filter={{ key: 'setebreddeMinCM', data: filters?.setebreddeMinCM }} />
      <RangeFilterInput filter={{ key: 'setebreddeMaksCM', data: filters?.setebreddeMaksCM }} />
      <RangeFilterInput filter={{ key: 'setedybdeMinCM', data: filters?.setedybdeMinCM }} />
      <RangeFilterInput filter={{ key: 'setedybdeMaksCM', data: filters?.setedybdeMaksCM }} />
      <RangeFilterInput filter={{ key: 'setehoydeMinCM', data: filters?.setehoydeMinCM }} />
      <RangeFilterInput filter={{ key: 'setehoydeMaksCM', data: filters?.setehoydeMaksCM }} />
      <RangeFilterInput filter={{ key: 'brukervektMinKG', data: filters?.brukervektMinKG }} />
      <RangeFilterInput filter={{ key: 'brukervektMaksKG', data: filters?.brukervektMaksKG }} />
      <CheckboxFilterInput filter={{ key: 'beregnetBarn', data: filters?.beregnetBarn }} />
      <CheckboxFilterInput filter={{ key: 'fyllmateriale', data: filters?.fyllmateriale }} />
      <CheckboxFilterInput filter={{ key: 'materialeTrekk', data: filters?.materialeTrekk }} />
    </div>
  )
}

export default FilterView
