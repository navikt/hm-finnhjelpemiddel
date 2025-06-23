import { mapSearchParams } from '@/utils/mapSearchParams'
import { ActionMenu, Alert, Button } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { CaretDownFillIcon, CaretUpFillIcon, TrashIcon } from '@navikt/aksel-icons'
import styles from './CheckboxFilterNew.module.scss'
import './checkbox-overrides.scss'
import React, { useState } from 'react'
import { FilterOption } from '@/app/rammeavtale/hjelpemidler/[agreementId]/AgreementPage'

const checkboxFilterCategoriesLabels = {
  leverandor: 'Leverandør',
  delkontrakt: 'Delkontrakt',
}

type CheckboxFilterInputProps = {
  filterKey: keyof typeof checkboxFilterCategoriesLabels
  allFilters: FilterOption[]
  onChange: (key: string, value: string) => void
}

export const CheckboxFilterNew = ({ filterKey, allFilters, onChange }: CheckboxFilterInputProps) => {
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)

  const selectedFilters = allFilters.filter((f) => searchData.filters[filterKey].includes(f.value))
  const notSelectedFilters = allFilters.filter((f) => !selectedFilters.find((filter) => filter.value === f.value)) || []

  const [menuOpen, setMenuOpen] = useState(false)

  if (!searchData.filters[filterKey].includes(filterKey) && !allFilters.length) {
    return <Alert variant={'warning'}>Hei</Alert>
  }

  const change = (value: string) => {
    onChange(filterKey, value)
  }

  const reset = () => {
    onChange(filterKey, '')
  }

  const filterLabel =
    selectedFilters.length > 0
      ? checkboxFilterCategoriesLabels[filterKey] + `(${selectedFilters.length})`
      : checkboxFilterCategoriesLabels[filterKey]

  const filterCheckbox = (option: FilterOption) => (
    <ActionMenu.CheckboxItem
      key={`${filterKey}-${option.label}}`}
      checked={selectedFilters.some((f) => f === option)}
      onCheckedChange={() => change(option.value)}
    >
      {option.label}
    </ActionMenu.CheckboxItem>
  )

  return (
    <ActionMenu onOpenChange={(open) => setMenuOpen(open)}>
      <ActionMenu.Trigger>
        <Button
          variant={'secondary'}
          size={'small'}
          icon={menuOpen ? <CaretUpFillIcon aria-hidden /> : <CaretDownFillIcon aria-hidden />}
          iconPosition={'right'}
          className={selectedFilters.length > 0 ? styles.filterButtonActive : styles.filterButton}
        >
          {filterLabel}
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content className={styles.filterMenu}>
        {selectedFilters.length > 0 && (
          <ActionMenu.Item variant={'danger'} icon={<TrashIcon />} onSelect={reset} style={{ paddingBlock: '0.5rem' }}>
            Fjern filter
          </ActionMenu.Item>
        )}
        {selectedFilters.map((f) => filterCheckbox(f))}
        {notSelectedFilters.map((f) => filterCheckbox(f))}
      </ActionMenu.Content>
    </ActionMenu>
  )
}
