import { Button, Chips, Heading, HStack, VStack } from '@navikt/ds-react'
import {
  FilterMenu,
  KategoriCheckboxFilter,
} from '@/app/kategori/bevegelse/manuelle-rullestoler/KategoriCheckboxFilter'
import { FilterToggle, KategoriToggleFilter } from '@/app/kategori/bevegelse/manuelle-rullestoler/KategoriToggleFilter'
import { IsoInfo, SupplierInfo } from '@/utils/kategori-inngang-util'
import { CircleSlashIcon } from '@navikt/aksel-icons'

export type Filters = {
  ['suppliers']: SupplierInfo[]
  ['isos']: IsoInfo[]
}

type Props = {
  filters: Filters
  onChange: (key: string, value: string) => void
  onReset: () => void
}

export const FilterBarKategori = ({ filters, onChange, onReset }: Props) => {
  const isoFilters: FilterToggle[] = filters.isos ? filters.isos.map((iso) => ({ key: iso.code, label: iso.name })) : []

  const supplierFilters: FilterMenu = {
    key: { key: 'supplier', label: 'Leverandører' },
    options: filters.suppliers ? filters.suppliers.map((supplier) => supplier.name) : [],
  }

  return (
    <VStack gap={'4'}>
      <Heading size={'small'}>Filter</Heading>
      <div>
        <Button variant={'danger'} size={'xsmall'} onClick={onReset} icon={<CircleSlashIcon />}>
          Nullstill filtere
        </Button>
      </div>
      <HStack gap="4">
        <KategoriCheckboxFilter
          filterKey={supplierFilters.key}
          allFilters={supplierFilters.options}
          onChange={onChange}
        />
        <Chips>
          {isoFilters.map((filter) => (
            <KategoriToggleFilter key={filter.key} searchParamKey={'iso'} filter={filter} onChange={onChange} />
          ))}
        </Chips>
      </HStack>
    </VStack>
  )
}
