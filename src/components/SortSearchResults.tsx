'use client'

import { isValidSortOrder, SearchData } from '@/utils/api-util'
import { Hide, Select, Show } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import React, { RefObject } from 'react'
import { useFormContext } from 'react-hook-form'

type Props = {
  formRef: RefObject<HTMLFormElement>
}

const SortSearchResults = ({ formRef }: Props) => {
  const formMethods = useFormContext<SearchData>()
  const searchParams = useSearchParams()

  const options = [
    { value: 'Delkontrakt_rangering', label: 'Delkontrakt og rangering' },
    { value: 'Best_soketreff', label: 'Beste søketreff' },
  ] as const

  const handleSelectedSorting = (event: React.FormEvent<HTMLSelectElement>) => {
    if (isValidSortOrder(event.currentTarget.value)) {
      formMethods.setValue('sortOrder', event.currentTarget.value)
      formRef.current?.requestSubmit()
    }
  }

  return (
    <>
      <Show above="lg">
        <Select
          size="small"
          label="Sortering"
          onChange={handleSelectedSorting}
          defaultValue={searchParams.get('sortering') ?? 'Best_soketreff'}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Show>
      <Hide above="lg">
        <Select
          size="small"
          label="Sortering"
          hideLabel
          onChange={handleSelectedSorting}
          defaultValue={searchParams.get('sortering') ?? 'Best_soketreff'}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Hide>
    </>
  )
}

export default SortSearchResults
