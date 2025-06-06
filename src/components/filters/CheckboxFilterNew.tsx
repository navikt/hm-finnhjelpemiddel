import { mapSearchParams } from '@/utils/mapSearchParams'
import { ActionMenu, Alert, Button } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { CaretDownFillIcon, TrashIcon } from '@navikt/aksel-icons'
import styles from './CheckboxFilterNew.module.scss'
import React from 'react'

const checkboxFilterCategoriesLabels = {
  leverandor: 'Leverandør',
  delkontrakt: 'Delkontrakt',
}

type CheckboxFilterInputProps = {
  filterKey: keyof typeof checkboxFilterCategoriesLabels
  allFilters: string[]
  onChange: (key: string, value: string) => void
}

export const CheckboxFilterNew = ({ filterKey, allFilters, onChange }: CheckboxFilterInputProps) => {
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)

  const selectedFilters = searchData.filters[filterKey].filter((value) => allFilters.includes(value))
  const notSelectedFilters = allFilters.filter((f) => !selectedFilters.includes(f)) || []

  if (!searchData.filters[filterKey].includes(filterKey) && !allFilters.length) {
    return <Alert variant={'warning'}>Hei</Alert>
  }

  const change = (value: string) => {
    onChange(filterKey, value)
  }

  const reset = () => {
    onChange(filterKey, '')
  }

  const filterCheckbox = (value: string) => (
    <ActionMenu.CheckboxItem
      key={`${filterKey}-${value}}`}
      checked={selectedFilters.some((f) => f === value)}
      onCheckedChange={() => change(value)}
    >
      {value}
    </ActionMenu.CheckboxItem>
  )

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          variant={'secondary'}
          size={'small'}
          icon={<CaretDownFillIcon aria-hidden />}
          iconPosition={'right'}
          className={styles.filterButton}
        >
          {checkboxFilterCategoriesLabels[filterKey]}
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content className={styles.filterMenu}>
        {selectedFilters.length > 0 && (
          <ActionMenu.Item variant={'danger'} icon={<TrashIcon />} onSelect={reset}>
            Fjern filter
          </ActionMenu.Item>
        )}
        {selectedFilters.map((f) => filterCheckbox(f))}
        {notSelectedFilters.map((f) => filterCheckbox(f))}
      </ActionMenu.Content>
    </ActionMenu>
  )
}
