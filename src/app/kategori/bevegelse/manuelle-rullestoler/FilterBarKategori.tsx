import { Chips, Heading, HStack, VStack } from '@navikt/ds-react'
import { KategoriCheckboxFilter } from '@/app/kategori/bevegelse/manuelle-rullestoler/KategoriCheckboxFilter'
import { KategoriToggleFilter } from '@/app/kategori/bevegelse/manuelle-rullestoler/KategoriToggleFilter'

type FilterOption = {
  label: string
  value: string
}

export type RullestolFilters = {
  [key in 'leverandor' | 'aktive' | 'allround' | 'komfort' | 'staa' | 'drivaggregat']: FilterOption[]
}

type Props = {
  filters: RullestolFilters
  onChange: (key: string, value: string) => void
}

const FilterBarKategori = ({ filters, onChange }: Props) => {
  return (
    <VStack gap={'4'}>
      <Heading size={'small'}>Filter</Heading>
      <HStack gap="4">
        {filters.leverandor.length > 0 && (
          <KategoriCheckboxFilter filterKey={'leverandor'} allFilters={filters.leverandor} onChange={onChange} />
        )}
        <Chips>
          {filters.aktive.length > 0 && (
            <KategoriToggleFilter filterKey={'aktive'} allFilters={filters.aktive} onChange={onChange} />
          )}
          {filters.staa.length > 0 && (
            <KategoriToggleFilter filterKey={'staa'} allFilters={filters.staa} onChange={onChange} />
          )}
          {filters.komfort.length > 0 && (
            <KategoriToggleFilter filterKey={'komfort'} allFilters={filters.komfort} onChange={onChange} />
          )}
          {filters.drivaggregat.length > 0 && (
            <KategoriToggleFilter filterKey={'drivaggregat'} allFilters={filters.drivaggregat} onChange={onChange} />
          )}
          {filters.allround.length > 0 && (
            <KategoriToggleFilter filterKey={'allround'} allFilters={filters.allround} onChange={onChange} />
          )}
        </Chips>
      </HStack>
    </VStack>
  )
}

export default FilterBarKategori
