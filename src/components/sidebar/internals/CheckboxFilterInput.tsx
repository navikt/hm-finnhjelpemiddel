import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox, CheckboxGroup } from '@navikt/ds-react'
import { FilterCategories } from '../../../utils/filter-util'
import { Filter, SearchData } from '../../../utils/api-util'
import { useHydratedSearchStore } from '../../../utils/search-state-util'
import { capitalize } from '../../../utils/string-util'

type CheckboxFilterInputProps = {
  filter: { key: keyof typeof FilterCategories; data?: Filter }
}
export const CheckboxFilterInput = ({ filter }: CheckboxFilterInputProps) => {
  const { key: filterKey, data: filterData } = filter

  const { searchData, setFilter } = useHydratedSearchStore()
  const {
    control,
    watch,
    formState: { touchedFields },
  } = useFormContext<SearchData>()
  const watchFilter = watch(`filters.${filterKey}`)
  const touched = touchedFields.filters && !!touchedFields.filters[filterKey]

  useEffect(() => {
    const filterValue = Array.isArray(watchFilter) ? watchFilter : [watchFilter]
    setFilter(filterKey, filterValue ?? '')
  }, [filterKey, setFilter, watchFilter])

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const hasFilterData = filterData?.values.length

  const selectedUnavailableFilters = watchFilter.filter(
    (f) => !(filterData?.values.map((f) => f.key) || []).includes(f)
  )

  if (!searchDataFilters.includes(filterKey) && !hasFilterData) {
    return null
  }

  return (
    <details open={watchFilter.length > 0 || touched}>
      <summary>{FilterCategories[filterKey]}</summary>
      <div>
        <Controller
          control={control}
          name={`filters.${filterKey}`}
          render={({ field }) => (
            <CheckboxGroup legend={FilterCategories[filterKey]} hideLegend {...field} size="small">
              {selectedUnavailableFilters?.map((f) => (
                <Checkbox value={f} key={f}>
                  {capitalize(String(f))} (0)
                </Checkbox>
              ))}
              {filterData?.values.map((f) => (
                <Checkbox value={f.key} key={f.key}>
                  {capitalize(String(f.key))} ({f.doc_count})
                </Checkbox>
              ))}
            </CheckboxGroup>
          )}
        />
      </div>
    </details>
  )
}