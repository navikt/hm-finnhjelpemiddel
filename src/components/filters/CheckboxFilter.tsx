import { Bucket, Filter } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { sortAlphabetically } from '@/utils/sort-util'
import { Checkbox, CheckboxGroup, Search, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import ShowMore from '../ShowMore'
import { FormSearchData } from '@/utils/search-state-util'

const checkboxFilterCategoriesLabels = {
  fyllmateriale: 'Fyllmateriale',
  materialeTrekk: 'Trekkmateriale',
  beregnetBarn: 'Beregnet på barn',
  leverandor: 'Leverandør',
  produktkategori: 'Produktkategori',
  rammeavtale: 'Rammeavtale',
  delkontrakt: 'Delkontrakt',
}

type ChecboxFilterKey = keyof typeof checkboxFilterCategoriesLabels

type CheckboxFilterInputProps = {
  filter: { key: ChecboxFilterKey; data?: Filter }
  showSearch?: boolean
}

export const CheckboxFilter = ({ filter, showSearch = false }: CheckboxFilterInputProps) => {
  const { key: filterKey, data: filterData } = filter
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])
  const [searchFilterTerm, setSearchFilterTerm] = useState<string>('')
  const [notSelectedFilters, setNotSelectedFilters] = useState<Bucket[]>([])

  const { control, watch, setValue } = useFormContext<FormSearchData>()

  const watchFilter = watch(`filters.${filterKey}`)

  const selectedFilters =
    filterData?.values.filter((f) => searchData.filters[filterKey].includes(f.key as string)) || []

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const filterValues = new Set(searchData.filters[filterKey])

      if (event.currentTarget.checked) filterValues.add(event.currentTarget.value)
      else filterValues.delete(event.currentTarget.value)
      setValue(`filters.${filterKey}`, Array.from(filterValues))
      event.currentTarget.form?.requestSubmit()
    },
    [searchData, filterKey, setValue]
  )

  const handleSearch = (value: string) => {
    setSearchFilterTerm(value)
  }

  useEffect(() => {
    setNotSelectedFilters(
      filterData?.values
        .filter((f) => !searchData.filters[filterKey].includes(f.key as string))
        .filter((bucket) => bucket.key.toString().toLowerCase().includes(searchFilterTerm.toLowerCase()))
        .sort((a, b) => sortAlphabetically(a.key.toString(), b.key.toString())) || []
    )
  }, [searchData, searchFilterTerm, searchParams, filterData])

  const selectedUnavailableFilters = watchFilter.filter(
    (f) => !(filterData?.values.map((f) => f.key) || []).includes(f)
  )

  if (!searchData.filters[filterKey].includes(filterKey) && !filterData?.values.length) {
    return null
  }

  const showMoreLabel =
    selectedFilters.length > 0
      ? `${checkboxFilterCategoriesLabels[filterKey]} (${selectedFilters.length + selectedUnavailableFilters.length})`
      : checkboxFilterCategoriesLabels[filterKey]

  return (
    <ShowMore
      title={showMoreLabel}
      spacing
      className={classNames('checkbox-filter', {
        active: selectedFilters.length + selectedUnavailableFilters.length > 0,
      })}
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
        <Controller
          control={control}
          name={`filters.${filterKey}`}
          render={({ field }) => (
            <CheckboxGroup
              legend={checkboxFilterCategoriesLabels[filterKey]}
              hideLegend
              size="small"
              id="filters"
              {...field}
            >
              {!showSearch && (
                <VStack gap="1" className="checkbox-filter__checkboxes">
                  {selectedUnavailableFilters?.map((f) => (
                    <Checkbox value={f} key={f} onChange={onChange} className="checkbox-filter__selected-unavailable">
                      {`${f} (0)`}
                    </Checkbox>
                  ))}
                  {filterData?.values.map((f) => (
                    <Checkbox value={f.key} key={f.key} onChange={onChange}>
                      {f.label || f.key}
                    </Checkbox>
                  ))}
                </VStack>
              )}
              {showSearch && (
                <>
                  <VStack gap="1" className="checkbox-filter__checkboxes" aria-label="Valgte filtre">
                    {selectedFilters.map((f) => (
                      <Checkbox value={f.key} key={`${filterKey}-${f.key}`} onChange={onChange}>
                        {f.label || f.key}
                      </Checkbox>
                    ))}
                    {selectedUnavailableFilters?.map((f) => (
                      <Checkbox value={f} key={f} onChange={onChange} className="checkbox-filter__selected-unavailable">
                        {`${f} (0)`}
                      </Checkbox>
                    ))}
                    <span className="filter-container__divider"></span>
                  </VStack>
                  <VStack
                    gap="1"
                    className="checkbox-filter__checkboxes checkbox-filter__scroll-container"
                    aria-label="Ikke valgte filtre"
                  >
                    {notSelectedFilters.map((f) => (
                      <Checkbox value={f.key} key={`${filterKey}-${f.key}`} onChange={onChange}>
                        {f.label || f.key}
                      </Checkbox>
                    ))}
                  </VStack>
                </>
              )}
            </CheckboxGroup>
          )}
        />
      </>
    </ShowMore>
  )
}
