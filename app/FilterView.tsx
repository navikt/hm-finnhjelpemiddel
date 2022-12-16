import { Heading } from '@navikt/ds-react'
import { RangeFilterInput } from './RangeFilterInput'

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

const FilterView = () => {
  return (
    <div className="search__filters">
      <Heading level="2" size="small" className="search__filter-heading">
        Filtre
      </Heading>

      <RangeFilterInput filterKey="lengdeCM" />
      <RangeFilterInput filterKey="breddeCM" />
      <RangeFilterInput filterKey="totalVektKG" />
      <RangeFilterInput filterKey="setebreddeMinCM" />
      <RangeFilterInput filterKey="setebreddeMaksCM" />
      <RangeFilterInput filterKey="setedybdeMinCM" />
      <RangeFilterInput filterKey="setedybdeMaksCM" />
      <RangeFilterInput filterKey="setehoydeMinCM" />
      <RangeFilterInput filterKey="setehoydeMaksCM" />
      <RangeFilterInput filterKey="brukervektMinKG" />
      <RangeFilterInput filterKey="brukervektMaksKG" />
    </div>
  )
}

export default FilterView
