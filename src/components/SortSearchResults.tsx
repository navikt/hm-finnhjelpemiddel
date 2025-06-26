'use client'

import { FormSearchData, isValidSortOrder } from '@/utils/search-state-util'
import { Select } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import React, { RefObject } from 'react'
import { useFormContext } from 'react-hook-form'

type Props = {
  formRef: RefObject<HTMLFormElement | null>
}

const SortSearchResults = ({ formRef }: Props) => {
  const formMethods = useFormContext<FormSearchData>()
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
      <Select
        size="small"
        label="Sortering"
        onChange={handleSelectedSorting}
        defaultValue={searchParams.get('sortering') ?? 'Best_soketreff'}
        hideLabel={true}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </>
  )
}

export default SortSearchResults
