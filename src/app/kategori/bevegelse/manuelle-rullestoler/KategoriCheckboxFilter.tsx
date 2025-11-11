import { Filter } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { FormSearchData } from '@/utils/search-state-util'
import { sortIntWithStringFallback } from '@/utils/sort-util'
import { Checkbox, CheckboxGroup, Search, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import ShowMore from '@/components/ShowMore'

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
  showSearch?: boolean
  openByDefault?: boolean
}

export const KategoriCheckboxFilter = ({
  filter,
  showSearch = false,
  openByDefault = undefined,
}: CheckboxFilterInputProps) => {
  const { key: filterKey, data: filterData } = filter
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const [searchFilterTerm, setSearchFilterTerm] = useState<string>('')

  const selectedFilters =
    filterData?.values?.filter((f) => searchData.filters[filterKey].includes(f.key as string)) || []

  const selectedUnavailableFilters = filterData?.values.map((f) => f.key.toString()) || []

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
    <ShowMore
      title={showMoreLabel}
      spacing
      className={classNames('checkbox-filter', {
        active: selectedFilters.length + selectedUnavailableFilters.length > 0,
      })}
      open={openByDefault}
    >
      <>
        {showSearch && (
          <Search
            className="checkbox-filter__search"
            label={`Søk etter filter i ${filterKey}`}
            hideLabel
            variant="simple"
            size="small"
            aria-controls="filters"
            clearButton={true}
            value={searchFilterTerm}
            onChange={(value) => handleSearch(value)}
          />
        )}

        <>
          <CheckboxGroup legend={checkboxFilterCategoriesLabels[filterKey]} hideLegend size="small" id="filters">
            {!showSearch && (
              <VStack gap="1" className="checkbox-filter__checkboxes checkbox-filter__scroll-container">
                {selectedFilters.map((f) => filterCheckbox(f.label ?? f.key.toString()))}
                {selectedUnavailableFilters?.map((f) => filterCheckbox(f, true))}
                {notSelectedFilters.map((f) => filterCheckbox(f.label ?? f.key.toString()))}
              </VStack>
            )}
            {showSearch && (
              <>
                <VStack gap="1" className="checkbox-filter__checkboxes" aria-label="Valgte filtre">
                  {selectedFilters.map((f) => filterCheckbox(f.label ?? f.key.toString()))}
                  {selectedUnavailableFilters.map((f) => filterCheckbox(f, true))}
                  <span className="filter-container__divider"></span>
                </VStack>
                <VStack
                  gap="1"
                  className="checkbox-filter__checkboxes checkbox-filter__scroll-container"
                  aria-label="Ikke valgte filtre"
                >
                  {notSelectedFilters.map((f) => filterCheckbox(f.label ?? f.key.toString()))}
                </VStack>
              </>
            )}
          </CheckboxGroup>
        </>
      </>
    </ShowMore>
  )
}
