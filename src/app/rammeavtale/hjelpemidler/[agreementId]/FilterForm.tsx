import { Heading, HStack, VStack } from '@navikt/ds-react'
import { CheckboxFilterNew, FilterMenu } from '@/components/filters/CheckboxFilterNew'

export type AgreementFilters = {
  [key in 'leverandor' | 'delkontrakt']: string[]
}

type Props = {
  filters: AgreementFilters
  onChange: (key: string, value: string) => void
}

const FilterForm = ({ filters, onChange }: Props) => {
  const postFilters: FilterMenu = {
    name: { key: 'delkontrakt', label: 'Delkontrakt' },
    options: filters.delkontrakt,
  }
  const supplierFilters: FilterMenu = {
    name: { key: 'leverandor', label: 'Leverandør' },
    options: filters.leverandor,
  }

  return (
    <VStack gap={'4'}>
      <Heading size={'small'}>Filter</Heading>
      <HStack gap="4">
        <CheckboxFilterNew filterMenu={postFilters} onChange={onChange} />
        <CheckboxFilterNew filterMenu={supplierFilters} onChange={onChange} />
      </HStack>
    </VStack>
  )
}

export default FilterForm
