import { Heading, HStack, VStack } from '@navikt/ds-react'
import { CheckboxFilterNew } from '@/components/filters/CheckboxFilterNew'
import { AgreementFilters } from '@/app/rammeavtale/hjelpemidler/[agreementId]/AgreementPage'

type Props = {
  filters: AgreementFilters
  onChange: (key: string, value: string) => void
}

const FilterForm = ({ filters, onChange }: Props) => {
  return (
    <VStack gap={'4'}>
      <Heading size={'small'}>Filter</Heading>
      <HStack gap="4">
        <CheckboxFilterNew filterKey={'delkontrakt'} allFilters={filters.delkontrakt} onChange={onChange} />
        <CheckboxFilterNew filterKey={'leverandor'} allFilters={filters.leverandor} onChange={onChange} />
      </HStack>
    </VStack>
  )
}

export default FilterForm
