import { Chips } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export type FilterToggle = {
  key: string
  label: string
}

type Props = {
  searchParamKey: string
  filter: FilterToggle
  onChange: (key: string, value: string) => void
}

export const KategoriToggleFilter = ({ searchParamKey, filter, onChange }: Props) => {
  const searchParams = useSearchParams()

  const change = (value: string) => {
    onChange(searchParamKey, value)
  }

  return (
    <Chips.Toggle
      selected={searchParams.has(searchParamKey, filter.key)}
      checkmark={false}
      key={filter.key}
      onClick={() => change(filter.key)}
    >
      {filter.label}
    </Chips.Toggle>
  )
}
