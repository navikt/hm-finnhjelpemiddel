import { ActionMenu, Button } from '@navikt/ds-react'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { CaretDownFillIcon, CaretUpFillIcon, TrashIcon } from '@navikt/aksel-icons'
import styles from '@/components/filters/CheckboxFilterNew.module.scss'

const initialFiltersFormState = {
  leverandor: [] as string[],
  aktive: [] as string[],
  allround: [] as string[],
  komfort: [] as string[],
  staa: [] as string[],
  drivaggregat: [] as string[],
}
type FilterFormState = typeof initialFiltersFormState

const initialSearchDataState = {
  searchTerm: '',
  isoCode: '',
  filters: initialFiltersFormState,
  sortOrder: undefined,
}

const mapSearchParams = (searchParams: ReadonlyURLSearchParams, agreementSearch?: boolean): SearchData => {
  const sortOrderStr = searchParams.get('sortering') || ''
  const sortOrder = isValidSortOrder(sortOrderStr) ? sortOrderStr : agreementSearch ? undefined : 'Best_soketreff'

  const searchTerm = searchParams.get('term') ?? ''
  const isoCode = searchParams.get('isoCode') ?? ''
  const hidePictures = searchParams.get('hidePictures') ?? ''

  const filterKeys = Object.keys(initialFiltersFormState).filter((filter) => searchParams?.has(filter))

  const filters = filterKeys.reduce(
    (obj, fk) => ({
      ...obj,
      [fk]: searchParams?.getAll(fk),
    }),
    {}
  )
  return {
    sortOrder,
    searchTerm,
    isoCode,
    filters: { ...initialSearchDataState.filters, ...filters },
    hidePictures,
  }
}

const sortOrders = ['Delkontrakt_rangering', 'Best_soketreff'] as const

type SortOrder = (typeof sortOrders)[number]

function isValidSortOrder(sortOrder: string): sortOrder is SortOrder {
  return sortOrders.includes(sortOrder as SortOrder)
}

type SearchData = {
  searchTerm: string
  isoCode?: string
  filters: FilterFormState
  sortOrder?: SortOrder
  hidePictures?: string
}
const checkboxFilterCategoriesLabels = {
  leverandor: 'Leverandør',
  aktive: 'Aktive rullestoler',
  allround: 'Allround rullestoler',
  komfort: 'Komfortrullestoler',
  staa: 'Ståfunksjon',
  drivaggregat: 'Drivaggregat',
}

type FilterOption = {
  label: string
  value: string
}
type CheckboxFilterInputProps2 = {
  filterKey: keyof typeof checkboxFilterCategoriesLabels
  allFilters: FilterOption[]
  onChange: (key: string, value: string) => void
}

export const KategoriCheckboxFilter = ({ filterKey, allFilters, onChange }: CheckboxFilterInputProps2) => {
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)

  const selectedFilters = allFilters.filter((f) => searchData.filters[filterKey].includes(f.value))

  const [menuOpen, setMenuOpen] = useState(false)

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
          <ActionMenu.Item variant={'danger'} icon={<TrashIcon />} onSelect={reset}>
            Fjern filter
          </ActionMenu.Item>
        )}
        {allFilters.map((f) => filterCheckbox(f))}
      </ActionMenu.Content>
    </ActionMenu>
  )
}
