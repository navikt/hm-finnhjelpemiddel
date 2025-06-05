import { mapSearchParams } from '@/utils/mapSearchParams'
import { ActionMenu, Alert, Button } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { CaretDownFillIcon } from '@navikt/aksel-icons'
import styles from './CheckboxFilterNew.module.scss'

const checkboxFilterCategoriesLabels = {
  leverandor: 'Leverandør',
  delkontrakt: 'Delkontrakt',
}

type ChecboxFilterKey = keyof typeof checkboxFilterCategoriesLabels

type CheckboxFilterInputProps = {
  filter: { key: ChecboxFilterKey; data: string[] }
  onChange: (key: string, value: string) => void
}

export const CheckboxFilterNew = ({ filter, onChange }: CheckboxFilterInputProps) => {
  const { key: filterKey, data: filterData } = filter
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)

  const selectedFilters = filterData.filter((f) => searchData.filters[filterKey].includes(f)) || []
  const notSelectedFilters = filterData.filter((f) => !searchData.filters[filterKey].includes(f)) || []
  const selectedUnavailableFilters = console.log('newFilterData', filterData)
  console.log('selectedFilters', selectedFilters)
  console.log('notSelectedFilters', notSelectedFilters)

  if (!searchData.filters[filterKey].includes(filterKey) && !filterData.length) {
    return <Alert variant={'warning'}>Hei</Alert>
  }

  const filterCheckbox = (value: string, unavailable?: boolean) => (
    <ActionMenu.CheckboxItem
      key={`${filterKey}-${value}}`}
      checked={selectedFilters.some((f) => f === value)}
      onCheckedChange={() => onChange(filterKey, value)}
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
      <ActionMenu.Content>
        {selectedFilters.map((f) => filterCheckbox(f))}
        {notSelectedFilters.map((f) => filterCheckbox(f))}
      </ActionMenu.Content>
    </ActionMenu>
  )
}
