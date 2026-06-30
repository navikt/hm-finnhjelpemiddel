import { useSearchParams } from 'next/navigation'
import { BodyShort, HStack, Select, VStack } from '@navikt/ds-react'
import { FilterContent } from '@/app/produkt-test/[id]/variantTable/filters/FilterRowTest'
import styles from './SelectFilters.module.scss'

export const SelectFilters = ({
  filters,
  onFilterChange,
}: {
  filters: FilterContent[]
  onFilterChange: (name: string, value: string) => void
}) => {
  const searchParams = useSearchParams()
  return (
    <HStack gap={'space-16'}>
      {filters.map(({ name, label, values, valueRange, unit }, index) => {
        return (
          values.length > 0 && (
            <Select
              key={index + 1}
              label={
                <VStack>
                  {label}
                  {valueRange && <BodyShort>{valueRange.map((value) => value + (unit ?? '')).join(' - ')}</BodyShort>}
                </VStack>
              }
              onChange={(event) => onFilterChange(name, event.target.value)}
              value={searchParams.get(name) ?? ''}
              className={styles.selectFilter}
            >
              <option key="" value="">
                Alle
              </option>
              {values.map((value, i) => (
                <option key={i + 1} label={value + (unit ? ` ${unit}` : '')}>
                  {value}
                </option>
              ))}
            </Select>
          )
        )
      })}
    </HStack>
  )
}
