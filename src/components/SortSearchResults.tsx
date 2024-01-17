'use client'

import React, { RefObject } from 'react'
import { Select } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { SearchData } from '@/utils/api-util'
import { useSearchParams } from 'next/navigation'

type Props = {
  formRef: RefObject<HTMLFormElement>
}

const SortSearchResults = ({ formRef }: Props) => {
  const formMethods = useFormContext<SearchData>()
  const searchParams = useSearchParams()

  const options = [
    { value: 'Alfabetisk', label: 'Alfabetisk' },
    { value: 'Avtale_rangering', label: 'Avtale rangering' },
    { value: 'Beste_treff', label: 'Beste treff' },
    { value: 'Nyeste', label: 'Nyeste' },
    { value: 'Sist_modifisert', label: 'Sist modifisert' },
  ]

  const handleSelectedSorting = (event: React.FormEvent<HTMLSelectElement>) => {
    formMethods.setValue('sortOrder', event.currentTarget.value)
    formRef.current?.requestSubmit()
  }

  return (
    <div>
      <Select label="Sortering" onChange={handleSelectedSorting} defaultValue={searchParams.get('sortOrder') ?? ''}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  )
}

export default SortSearchResults
