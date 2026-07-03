import { useSearchParams } from 'next/navigation'
import { Checkbox, CheckboxGroup, HStack } from '@navikt/ds-react'
import { FilterContent } from '@/app/produkt-test/[id]/variantTable/filters/FilterRowTest'

export const AgreementCheckbox = ({
  filters,
  onFilterChange,
}: {
  filters: FilterContent[]
  onFilterChange: (name: string, value: string) => void
}) => {
  const searchParams = useSearchParams()

  return (
    <CheckboxGroup legend="Filtrer" hideLegend>
      <HStack gap="space-16" wrap>
        {filters.map(({ name, label, values }) => (
          <Checkbox
            key={name}
            checked={searchParams.has(name)}
            onChange={(event) => onFilterChange(name, event.target.checked ? 'true' : '')}
            disabled={values.length < 2}
          >
            {label}
          </Checkbox>
        ))}
      </HStack>
    </CheckboxGroup>
  )
}
