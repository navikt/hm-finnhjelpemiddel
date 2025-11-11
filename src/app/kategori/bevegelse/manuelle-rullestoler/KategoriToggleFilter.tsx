import { Chips } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const checkboxFilterCategoriesLabels = {
  leverandor: 'Leverandør',
  aktive: 'Aktive rullestoler',
  allround: 'Allround rullestoler',
  komfort: 'Komfortrullestoler',
  staa: 'Ståfunksjon',
  drivaggregat: 'Drivaggregat',
}

type FilterOption = {
  label: string
  value: string
}
type CheckboxFilterInputProps2 = {
  filterKey: keyof typeof checkboxFilterCategoriesLabels
  allFilters: FilterOption[]
  onChange: (key: string, value: string) => void
}

export const KategoriToggleFilter = ({ filterKey, onChange }: CheckboxFilterInputProps2) => {
  const searchParams = useSearchParams()

  const change = (value: string) => {
    onChange(filterKey, value)
  }

  return (
    <Chips.Toggle
      selected={searchParams.has(filterKey)}
      checkmark={false}
      key={filterKey}
      onClick={() => change(searchParams.has(filterKey) ? '' : 'true')}
    >
      {checkboxFilterCategoriesLabels[filterKey]}
    </Chips.Toggle>
  )
}
