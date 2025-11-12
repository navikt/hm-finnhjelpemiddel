import { ActionMenu, Button } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { CaretDownFillIcon, CaretUpFillIcon, TrashIcon } from '@navikt/aksel-icons'
import styles from '@/components/filters/CheckboxFilterNew.module.scss'

export type FilterMenuLabel = {
  key: string
  label: string
}

export type FilterMenu = {
  key: FilterMenuLabel
  options: string[]
}

type Props = {
  filterKey: FilterMenuLabel
  allFilters: string[]
  onChange: (key: string, value: string) => void
}

export const KategoriCheckboxFilter = ({ filterKey, allFilters, onChange }: Props) => {
  const searchParams = useSearchParams()

  const selectedFilters = allFilters.filter((f) => searchParams.getAll(filterKey.key).includes(f))

  const [menuOpen, setMenuOpen] = useState(false)

  const change = (value: string) => {
    onChange(filterKey.key, value)
  }

  const reset = () => {
    onChange(filterKey.key, '')
  }

  const filterLabel = selectedFilters.length > 0 ? filterKey.label + `(${selectedFilters.length})` : filterKey.label

  const filterCheckbox = (option: string) => (
    <ActionMenu.CheckboxItem
      key={`${filterKey.key}-${option}}`}
      checked={selectedFilters.some((f) => f === option)}
      onCheckedChange={() => change(option)}
    >
      {option}
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
          <ActionMenu.Item variant={'danger'} icon={<TrashIcon />} onSelect={reset}>
            Fjern filter
          </ActionMenu.Item>
        )}
        {allFilters.map((f) => filterCheckbox(f))}
      </ActionMenu.Content>
    </ActionMenu>
  )
}
