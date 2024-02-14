import React, { useCallback, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Button, Checkbox, CheckboxGroup } from '@navikt/ds-react'

import { Filter, SearchData } from '@/utils/api-util'
import { FilterCategories } from '@/utils/filter-util'

import ShowMore from '@/components/ShowMore'
// import { mapProductSearchParams } from '@/utils/product-util'
import { mapSearchParams } from '@/utils/product-util'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'

type CheckboxFilterInputProps = {
  filter: { key: keyof typeof FilterCategories; data?: Filter }
}

export const CheckboxFilterInput = ({ filter }: CheckboxFilterInputProps) => {
  const { key: filterKey, data: filterData } = filter
  const [showAllValues, setShowAllValues] = useState(false)
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const {
    control,
    formState: { touchedFields },
    watch,
    setValue,
  } = useFormContext<SearchData>()

  const watchFilter = watch(`filters.${filterKey}`)

  const touched = touchedFields.filters && !!touchedFields.filters[filterKey]

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const hasFilterData = filterData?.values.length

  const numberOfActiveFilters = searchData.filters[filterKey].length

  const selectedUnavailableFilters = watchFilter.filter(
    (f) => !(filterData?.values.map((f) => f.key) || []).includes(f)
  )

  const selectedInvisibleFilters = filterData?.values
    .slice(10)
    .filter((f) => watchFilter.includes(f.key) || searchData.filters[filterKey].includes(f.key))

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

  if (!searchDataFilters.includes(filterKey) && !hasFilterData) {
    return null
  }

  const CheckboxLabel = ({ value }: { value: string | number }) => <>{value}</>
  const showMoreLabel =
    numberOfActiveFilters > 0
      ? `${FilterCategories[filterKey]} (${numberOfActiveFilters})`
      : FilterCategories[filterKey]

  return (
    <ShowMore
      title={showMoreLabel}
      open={watchFilter.length > 0 || searchData.filters[filterKey].length > 0 || touched}
      spacing
      className={classNames('checkbox-filter', { active: numberOfActiveFilters > 0 })}
    >
      <div className="checkbox-filter-input">
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
              {selectedUnavailableFilters?.map((f) => (
                <Checkbox value={f} key={f} onChange={onChange}>
                  <CheckboxLabel value={f} />
                </Checkbox>
              ))}
              {filterData?.values.slice(0, 10).map((f) => (
                <Checkbox value={f.key} key={f.key} onChange={onChange}>
                  <CheckboxLabel value={f.label || f.key} />
                </Checkbox>
              ))}
              {showAllValues &&
                filterData?.values.slice(10).map((f) => (
                  <Checkbox value={f.key} key={f.key} onChange={onChange}>
                    <CheckboxLabel value={f.label || f.key} />
                  </Checkbox>
                ))}
              {!showAllValues &&
                selectedInvisibleFilters?.map((f) => (
                  <Checkbox value={f.key} key={f.key} onChange={onChange}>
                    <CheckboxLabel value={f.label || f.key} />
                  </Checkbox>
                ))}
            </CheckboxGroup>
          )}
        />
      </div>
      {filterData?.values && filterData?.values.length > 10 && (
        <Button type="button" variant="tertiary" size="small" onClick={() => setShowAllValues((v) => !v)}>
          {!showAllValues ? 'Vis alle' : 'Vis kun utvalgte'}
        </Button>
      )}
    </ShowMore>
  )
}
