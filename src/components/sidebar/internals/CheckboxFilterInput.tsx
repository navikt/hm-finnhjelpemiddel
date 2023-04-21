import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button, Checkbox, CheckboxGroup, ExpansionCard } from '@navikt/ds-react'
import { FilterCategories } from '../../../utils/filter-util'
import { Filter, SearchData } from '../../../utils/api-util'
import { useHydratedSearchStore } from '../../../utils/search-state-util'
import { capitalize } from '../../../utils/string-util'

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

  return (
    <ExpansionCard
      size="small"
      defaultOpen={watchFilter.length > 0 || touched}
      aria-label={`Filter ${FilterCategories[filterKey]}`}
      style={{ marginBottom: 12 }}
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title size="small" style={{ fontSize: 18, fontWeight: 300 }}>
          {FilterCategories[filterKey]}
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <>
          <Controller
            control={control}
            name={`filters.${filterKey}`}
            render={({ field }) => (
              <CheckboxGroup legend={FilterCategories[filterKey]} hideLegend {...field}>
                {selectedUnavailableFilters?.map((f) => (
                  <Checkbox value={f} key={f}>
                    {capitalize(String(f))} (0)
                  </Checkbox>
                ))}
                {filterData?.values.slice(0, 10).map((f) => (
                  <Checkbox value={f.key} key={f.key}>
                    {capitalize(String(f.key))} ({f.doc_count})
                  </Checkbox>
                ))}
                {showAllValues &&
                  filterData?.values.slice(10).map((f) => (
                    <Checkbox value={f.key} key={f.key}>
                      {capitalize(String(f.key))} ({f.doc_count})
                    </Checkbox>
                  ))}
                {!showAllValues &&
                  selectedInvisibleFilters?.map((f) => (
                    <Checkbox value={f.key} key={f.key}>
                      {capitalize(String(f.key))} ({f.doc_count})
                    </Checkbox>
                  ))}
              </CheckboxGroup>
            )}
          />
          {filterData?.values && filterData?.values.length > 10 && (
            <Button type="button" variant="tertiary" onClick={() => setShowAllValues((v) => !v)}>
              {!showAllValues ? 'Vis alle' : 'Vis kun utvalgte'}
            </Button>
          )}
        </>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
