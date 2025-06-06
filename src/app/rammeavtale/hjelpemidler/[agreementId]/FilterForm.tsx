import { Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { CheckboxFilterNew } from '@/components/filters/CheckboxFilterNew'
import { AgreementFilters } from '@/app/rammeavtale/hjelpemidler/[agreementId]/AgreementPage'

type Props = {
  filters: AgreementFilters
  onChange: (key: string, value: string) => void
  onReset?: () => void
}

const FilterForm = ({ filters, onChange, onReset }: Props) => {
  return (
    <VStack gap={'4'}>
      <Heading size={'small'}>Filter</Heading>
      <HStack gap="4" className="filter-container__filters filter-container__horizontal">
        <CheckboxFilterNew filterKey={'delkontrakt'} allFilters={filters.delkontrakt} onChange={onChange} />
        <CheckboxFilterNew filterKey={'leverandor'} allFilters={filters.leverandor} onChange={onChange} />
        {onReset && (
          <Button variant={'secondary'} size={'small'} onClick={onReset}>
            Fjern alle filtre
          </Button>
        )}
      </HStack>
    </VStack>
  )
}

export default FilterForm
