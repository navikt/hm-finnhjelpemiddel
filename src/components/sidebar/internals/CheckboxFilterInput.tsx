import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button, Checkbox, CheckboxGroup, Detail } from '@navikt/ds-react'
import { FilterCategories } from '@/utils/filter-util'
import { Filter, SearchData } from '@/utils/api-util'
import { useHydratedSearchStore } from '@/utils/search-state-util'
import { capitalize } from '@/utils/string-util'

type CheckboxFilterInputProps = {
  filter: { key: keyof typeof FilterCategories; data?: Filter }
}
export const CheckboxFilterInput = ({ filter }: CheckboxFilterInputProps) => {
  const { key: filterKey, data: filterData } = filter
  const [showAllValues, setShowAllValues] = useState(false)

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

  const selectedInvisibleFilters = filterData?.values.slice(10).filter((f) => watchFilter.includes(f.key))

  if (!searchDataFilters.includes(filterKey) && !hasFilterData) {
    return null
  }

  const CheckboxLabel = ({ value, hitCount }: { value: string | number; hitCount: number }) => (
    <>
      {capitalize(String(value))} <Detail style={{ display: 'inline' }}>({String(hitCount)})</Detail>
    </>
  )

  return (
    <details open={watchFilter.length > 0 || touched}>
      <summary>{FilterCategories[filterKey]}</summary>
      <div>
        <div className="checkbox-filter-input">
          <Controller
            control={control}
            name={`filters.${filterKey}`}
            render={({ field }) => (
              <CheckboxGroup legend={FilterCategories[filterKey]} hideLegend {...field} size="small">
                {selectedUnavailableFilters?.map((f) => (
                  <Checkbox value={f} key={f}>
                    <CheckboxLabel value={f} hitCount={0} />
                  </Checkbox>
                ))}
                {filterData?.values.slice(0, 10).map((f) => (
                  <Checkbox value={f.key} key={f.key}>
                    <CheckboxLabel value={f.key} hitCount={f.doc_count} />
                  </Checkbox>
                ))}
                {showAllValues &&
                  filterData?.values.slice(10).map((f) => (
                    <Checkbox value={f.key} key={f.key}>
                      <CheckboxLabel value={f.key} hitCount={f.doc_count} />
                    </Checkbox>
                  ))}
                {!showAllValues &&
                  selectedInvisibleFilters?.map((f) => (
                    <Checkbox value={f.key} key={f.key}>
                      <CheckboxLabel value={f.key} hitCount={f.doc_count} />
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
      </div>
    </details>
  )
}
