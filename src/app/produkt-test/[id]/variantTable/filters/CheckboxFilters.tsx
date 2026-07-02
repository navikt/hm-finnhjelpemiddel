import { useSearchParams } from 'next/navigation'
import { Checkbox } from '@navikt/ds-react'
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
    <>
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
    </>
  )
}
