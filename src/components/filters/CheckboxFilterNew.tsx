import { Filter } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { FormSearchData } from '@/utils/search-state-util'
import { sortIntWithStringFallback } from '@/utils/sort-util'
import { ActionMenu, Button, Checkbox } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronDownIcon } from '@navikt/aksel-icons'
import styles from './CheckboxFilterNew.module.scss'

const checkboxFilterCategoriesLabels = {
  fyllmateriale: 'Fyllmateriale',
  materialeTrekk: 'Trekkmateriale',
  beregnetBarn: 'Beregnet på barn',
  leverandor: 'Leverandør',
  produktkategori: 'Produktkategori',
  rammeavtale: 'Rammeavtale',
  delkontrakt: 'Delkontrakt',
  vis: 'Vis',
  categories: 'Kategori',
}

type ChecboxFilterKey = keyof typeof checkboxFilterCategoriesLabels

type CheckboxFilterInputProps = {
  filter: { key: ChecboxFilterKey; data?: Filter }
  name: string
  showSearch?: boolean
  openByDefault?: boolean
}

export const CheckboxFilterNew = ({
  filter,
  name,
  showSearch = false,
  openByDefault = undefined,
}: CheckboxFilterInputProps) => {
  const { key: filterKey, data: filterData } = filter
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const [searchFilterTerm, setSearchFilterTerm] = useState<string>('')

  const { control, watch } = useFormContext<FormSearchData>()

  const watchFilter = watch(`filters.${filterKey}`) || []
  const selectedFilters =
    filterData?.values?.filter((f) => searchData.filters[filterKey].includes(f.key as string)) || []

  const selectedUnavailableFilters = watchFilter.filter(
    (f) => !(filterData?.values.map((f) => f.key) || []).includes(f)
  )

  const notSelectedFilters =
    filterData?.values
      ?.filter((f) => !searchData.filters[filterKey].includes(f.key as string))
      .filter((bucket) => bucket.key.toString().toLowerCase().includes(searchFilterTerm.toLowerCase()))
      .sort((a, b) => sortIntWithStringFallback(a.key.toString(), b.key.toString())) || []

  const handleSearch = (value: string) => {
    setSearchFilterTerm(value)
  }

  if (!searchData.filters[filterKey].includes(filterKey) && !filterData?.values.length) {
    return null
  }

  const showMoreLabel =
    selectedFilters.length > 0
      ? `${checkboxFilterCategoriesLabels[filterKey]} (${selectedFilters.length + selectedUnavailableFilters.length})`
      : checkboxFilterCategoriesLabels[filterKey]

  const filterCheckbox = (filterName: string, unavailable?: boolean) => (
    <Checkbox
      name={filterName}
      value={filterName}
      key={`${filterKey}-${filterName}}`}
      className={unavailable ? 'checkbox-filter__selected-unavailable' : ''}
      onKeyDown={(event) => {
        if (event.key === 'Space') {
          event.preventDefault()
          event.currentTarget?.form?.requestSubmit()
        }
      }}
      onChange={(e) => {
        e.currentTarget?.form?.requestSubmit()
      }}
    >
      {unavailable ? `${filterName} (0)` : filterName}
    </Checkbox>
  )

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          variant={'secondary'}
          size={'xsmall'}
          icon={<ChevronDownIcon aria-hidden />}
          iconPosition={'right'}
          className={styles.filterButton}
        >
          {name}
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content></ActionMenu.Content>
    </ActionMenu>
  )
}
