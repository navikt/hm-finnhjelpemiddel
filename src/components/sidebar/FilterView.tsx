import { BodyShort, Heading, Label } from '@navikt/ds-react'
import { RangeFilterInput } from '../search/RangeFilterInput'
import { FilterData } from '../../utils/api-util'
import { useHydratedSearchStore } from '../../utils/search-state-util'

export enum FilterCategories {
  lengdeCM = 'Lengde (cm)',
  breddeCM = 'Bredde (cm)',
  setebreddeMinCM = 'Min. setebredde (cm)',
  setebreddeMaksCM = 'Maks. setebredde (cm)',
  setedybdeMinCM = 'Min. setedybde (cm)',
  setedybdeMaksCM = 'Maks. setedybde (cm)',
  setehoydeMinCM = 'Min. setehøyde (cm)',
  setehoydeMaksCM = 'Maks. setehøyde (cm)',
  brukervektMinKG = 'Min. brukervekt (kg)',
  brukervektMaksKG = 'Maks. brukervekt (kg)',
  totalVektKG = 'Totalvekt (kg)',
  fyllmateriale = 'Fyllmateriale',
  materialeTrekk = 'Trekkmateriale',
  beregnetBarn = 'Beregnet barn?',
}

const FilterView = ({ filters }: { filters?: FilterData }) => {
  const { searchData } = useHydratedSearchStore()
  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(isNaN(value) || value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  if (!searchDataFilters.length && (!filters || !Object.keys(filters).length)) {
    return (
      <div className="search__filters">
        <Heading level="2" size="xsmall" className="search__filter-heading">
          Filtre
        </Heading>
        <BodyShort>Ingen tilgjengelige filtre</BodyShort>
      </div>
    )
  }

  return (
    <div className="search__filters">
      <Label className="search__filter-lable">Filtre</Label>
      <RangeFilterInput filterKey="lengdeCM" filters={filters} />
      <RangeFilterInput filterKey="breddeCM" filters={filters} />
      <RangeFilterInput filterKey="totalVektKG" filters={filters} />
      <RangeFilterInput filterKey="setebreddeMinCM" filters={filters} />
      <RangeFilterInput filterKey="setebreddeMaksCM" filters={filters} />
      <RangeFilterInput filterKey="setedybdeMinCM" filters={filters} />
      <RangeFilterInput filterKey="setedybdeMaksCM" filters={filters} />
      <RangeFilterInput filterKey="setehoydeMinCM" filters={filters} />
      <RangeFilterInput filterKey="setehoydeMaksCM" filters={filters} />
      <RangeFilterInput filterKey="brukervektMinKG" filters={filters} />
      <RangeFilterInput filterKey="brukervektMaksKG" filters={filters} />
    </div>
  )
}

export default FilterView
