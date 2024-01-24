'use client'

import React, { RefObject } from 'react'
import { Select } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { isValidSortOrder, SearchData } from '@/utils/api-util'
import { useSearchParams } from 'next/navigation'

type Props = {
  formRef: RefObject<HTMLFormElement>
}

const SortSearchResults = ({ formRef }: Props) => {
  const formMethods = useFormContext<SearchData>()
  const searchParams = useSearchParams()

  const options = [
    { value: 'Alfabetisk', label: 'Alfabetisk' },
    { value: 'Beste_treff', label: 'Beste treff' },
    { value: 'Delkontrakt_rangering', label: 'Delkontrakt og rangering' },
    { value: 'Rangering_delkontrakt', label: 'Rangering og delkontrakt' },
  ] as const

  const handleSelectedSorting = (event: React.FormEvent<HTMLSelectElement>) => {
    if (isValidSortOrder(event.currentTarget.value)) {
      formMethods.setValue('sortOrder', event.currentTarget.value)
      formRef.current?.requestSubmit()
    }
  }

  return (
    <Select label="Sortering" onChange={handleSelectedSorting} defaultValue={searchParams.get('sortering') ?? ''}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}

export default SortSearchResults
