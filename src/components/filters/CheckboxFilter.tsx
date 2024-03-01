import { Bucket, Filter, SearchData } from '@/utils/api-util'
import { FilterCategories } from '@/utils/filter-util'
import { mapSearchParams } from '@/utils/product-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { Checkbox, CheckboxGroup, Search, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import ShowMore from '../ShowMore'

type CheckboxFilterInputProps = {
  filter: { key: keyof typeof FilterCategories; data?: Filter }
  showSearch?: boolean
}

export const CheckboxFilter = ({ filter, showSearch = false }: CheckboxFilterInputProps) => {
  const { key: filterKey, data: filterData } = filter
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])
  const [searchFilterTerm, setSearchFilterTerm] = useState<string>('')
  const [notSelectedFilters, setNotSelectedFilters] = useState<Bucket[]>([])

  const {
    control,
    formState: { touchedFields },
    watch,
    setValue,
  } = useFormContext<SearchData>()

  const watchFilter = watch(`filters.${filterKey}`)
  const touched = touchedFields.filters && !!touchedFields.filters[filterKey]

  let selectedFilters = filterData?.values.filter((f) => searchData.filters[filterKey].includes(f.key)) || []

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
        .filter((f) => !searchData.filters[filterKey].includes(f.key))
        .filter((bucket) => bucket.key.toString().toLowerCase().startsWith(searchFilterTerm.toLowerCase()))
        .sort((a, b) => sortAlphabetically(a.key.toString(), b.key.toString())) || []
    )
  }, [searchData, searchFilterTerm, searchParams, filterData])

  const selectedUnavailableFilters = watchFilter.filter(
    (f) => !(filterData?.values.map((f) => f.key) || []).includes(f)
  )

  // const selectedInvisibleFilters = filterData?.values.filter(
  //   (f) => watchFilter.includes(f.key) || searchData.filters[filterKey].includes(f.key)
  // )

  if (!searchData.filters[filterKey].includes(filterKey) && !filterData?.values.length) {
    return null
  }

  // const sortedFilters = filterData?.values.sort((a, b) => )
  const showMoreLabel =
    selectedFilters.length > 0
      ? `${FilterCategories[filterKey]} (${selectedFilters.length})`
      : FilterCategories[filterKey]

  return (
    <ShowMore
      title={showMoreLabel}
      open={watchFilter.length > 0 || searchData.filters[filterKey].length > 0 || touched}
      spacing
      className={classNames('checkbox-filter', { active: selectedFilters.length > 0 })}
    >
      <>
        {showSearch && (
          <Search
            className="checkbox-filter__search"
            label={`Søk etter filter i ${filterKey}`}
            hideLabel
            variant="simple"
            size="small"
            clearButton={true}
            // placeholder="Søk etter rammeavtale"
            value={searchFilterTerm}
            onChange={(value) => handleSearch(value)}
          />
        )}
        <Controller
          control={control}
          name={`filters.${filterKey}`}
          render={({ field }) => (
            <CheckboxGroup
              legend={FilterCategories[filterKey]}
              hideLegend
              size="small"
              {...field}
              value={searchData.filters[filterKey]}
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
                  <VStack gap="1" className="checkbox-filter__checkboxes">
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
                  <VStack gap="1" className="checkbox-filter__checkboxes checkbox-filter__scroll-container">
                    {notSelectedFilters.map((f) => (
                      <Checkbox value={f.key} key={`${filterKey}-${f.key}`} onChange={onChange}>
                        {f.label || f.key}
                      </Checkbox>
                    ))}
                    {/* {selectedInvisibleFilters?.map((f) => (
                  <Checkbox value={f.key} key={`${filterKey}-${f.key}`} onChange={onChange}>
                  {f.label || f.key}
                  </Checkbox>
                ))} */}
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
