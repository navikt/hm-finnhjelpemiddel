'use client'

import { isValidSortOrder } from '@/utils/search-state-util'
import { Select } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const SortKategoriResults = () => {
  const searchParams = useSearchParams()

  const options = [
    { value: 'Delkontrakt_rangering', label: 'Delkontrakt og rangering' },
    { value: 'Best_soketreff', label: 'Beste søketreff' },
  ] as const

  const handleSelectedSorting = (event: React.FormEvent<HTMLSelectElement>) => {
    if (isValidSortOrder(event.currentTarget.value)) {
    }
  }

  return (
    <Select
      size="small"
      label="Sortering"
      onChange={handleSelectedSorting}
      defaultValue={searchParams.get('sortering') ?? 'Delkontrakt_rangering'}
      hideLabel={true}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}

export default SortKategoriResults
