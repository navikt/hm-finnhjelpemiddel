import { useSearchParams } from 'next/navigation'
import { Chips } from '@navikt/ds-react'
import styles from '@/app/produkt-test/[id]/variantTable/filters/FilterRowTest.module.scss'
import { FilterContent } from '@/app/produkt-test/[id]/variantTable/filters/FilterRowTest'

export const ChipFilters = ({
  filters,
  onFilterChange,
}: {
  filters: FilterContent[]
  onFilterChange: (name: string, value: string) => void
}) => {
  const searchParams = useSearchParams()

  return (
    <Chips className={styles.chipsRow}>
      {filters.map(({ name, label, values }) => {
        return (
          <Chips.Toggle
            selected={searchParams.has(name)}
            checkmark={true}
            key={name}
            onClick={() => onFilterChange(name, searchParams.has(name) ? '' : 'true')}
            disabled={values.length < 2}
            className={values.length < 2 ? styles.disabledChip : styles.enabledChip}
          >
            {label}
          </Chips.Toggle>
        )
      })}
    </Chips>
  )
}
