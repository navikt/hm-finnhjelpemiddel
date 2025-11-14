import { Button, Chips, Heading, HStack, VStack } from '@navikt/ds-react'
import { KategoriToggleFilter } from '@/app/kategori/[iso]/KategoriToggleFilter'
import { CircleSlashIcon } from '@navikt/aksel-icons'
import { CheckboxFilterNew, FilterMenu } from '@/components/filters/CheckboxFilterNew'

export type Filters = {
  ['suppliers']: string[]
  ['isos']: {
    key: string
    label: string
  }[]
}

type Props = {
  filters: Filters
  onChange: (key: string, value: string) => void
  onReset: () => void
}

export const FilterBarKategori = ({ filters, onChange, onReset }: Props) => {
  const supplierFilters: FilterMenu = {
    name: { key: 'supplier', label: 'Leverandører' },
    options: filters.suppliers,
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
        <CheckboxFilterNew filterMenu={supplierFilters} onChange={onChange} />
        <Chips>
          {filters.isos.map((filter) => (
            <KategoriToggleFilter key={filter.key} searchParamKey={'iso'} filter={filter} onChange={onChange} />
          ))}
        </Chips>
      </HStack>
    </VStack>
  )
}
