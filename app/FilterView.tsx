import { BodyShort, Heading } from '@navikt/ds-react'
import { RangeFilterInput } from './RangeFilterInput'
import { FilterData } from '../utils/api-util'

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
  if (!filters || !Object.keys(filters).length) {
    return (
      <div className="search__filters">
        <Heading level="2" size="small" className="search__filter-heading">
          Filtre
        </Heading>
        <BodyShort>Ingen tilgjengelige filtre</BodyShort>
      </div>
    )
  }

  return (
    <div className="search__filters">
      <Heading level="2" size="small" className="search__filter-heading">
        Filtre
      </Heading>
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
