import { Chips } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import styles from './KategoriToggleFilter.module.scss'
import { getIsoLabel } from '../utils/mappings/isoLabelMapping'

export type FilterToggle = {
  key: string
  label: string
}

type Props = {
  searchParamKey: string
  filter: FilterToggle[]
  onChange: (key: string, value: string) => void
}

export const KategoriToggleFilter = ({ searchParamKey, filter, onChange }: Props) => {
  const searchParams = useSearchParams()

  return (
    <Chips className={styles.chips}>
      {filter.map((option) => (
        <Chips.Toggle
          selected={searchParams.has(searchParamKey, option.key)}
          checkmark={false}
          key={option.key}
          onClick={() => onChange(searchParamKey, option.key)}
        >
          {getIsoLabel(option.key, option.label)}
        </Chips.Toggle>
      ))}
    </Chips>
  )
}
