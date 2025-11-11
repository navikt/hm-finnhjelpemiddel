'use client'

import { isValidSortOrder } from '@/utils/search-state-util'
import { Select } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import useQueryString from '@/utils/search-params-util'

export const SortKategoriResults = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { createQueryString } = useQueryString()

  const options = [
    { value: 'Delkontrakt_rangering', label: 'Delkontrakt og rangering' },
    { value: 'Best_soketreff', label: 'Beste søketreff' },
    { value: 'Rangering', label: 'Rangering' },
  ] as const

  const handleSelectedSorting = (event: React.FormEvent<HTMLSelectElement>) => {
    if (isValidSortOrder(event.currentTarget.value)) {
      const newSearchParams = createQueryString('sortering', event.currentTarget.value)
      router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
    }
  }

  return (
    <Select
      size="small"
      label="Sortering"
      onChange={handleSelectedSorting}
      defaultValue={searchParams.get('sortering') ?? 'Rangering'}
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
