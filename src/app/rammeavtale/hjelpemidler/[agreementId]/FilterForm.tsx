import { Heading, HStack, VStack } from '@navikt/ds-react'
import { CheckboxFilterNew, FilterMenu } from '@/components/filters/CheckboxFilterNew'

export type AgreementFilters = {
  [key in 'leverandor' | 'delkontrakt']: string[]
}

type Props = {
  filters: AgreementFilters
  onChange: (key: string, value: string | string[]) => void
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
    <VStack gap={"space-16"}>
      <Heading size={'small'}>Filter</Heading>
      <HStack gap="space-16">
        <CheckboxFilterNew filterMenu={postFilters} onChange={onChange} />
        <CheckboxFilterNew filterMenu={supplierFilters} onChange={onChange} />
      </HStack>
    </VStack>
  );
}

export default FilterForm
