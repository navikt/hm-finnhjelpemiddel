import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Detail, TextField } from '@navikt/ds-react'
import { Filter, SearchData } from '@/utils/api-util'
import { FilterCategories } from '@/utils/filter-util'
import { useHydratedSearchStore } from '@/utils/search-state-util'

type FilterProps = {
  filter: { key: keyof typeof FilterCategories; data?: Filter }
  variant?: 'min-max' | 'min' | 'max'
}

export const RangeFilterInput = ({ filter, variant = 'min-max' }: FilterProps) => {
  const { key: filterKey, data: filterData } = filter

  const { searchData, setFilter } = useHydratedSearchStore()
  const {
    control,
    formState: { dirtyFields, isSubmitting, isValid, touchedFields },
    trigger,
    setValue,
    watch,
  } = useFormContext<SearchData>()

  const [min, max] = watch(`filters.${filterKey}`) || []

  useEffect(() => {
    if (isSubmitting && !isValid) {
      const maxValue = Math.max(min, max)
      setFilter(filterKey, [maxValue, maxValue])
      setValue(`filters.${filterKey}`, [maxValue, maxValue])
    }
  }, [filterKey, isSubmitting, isValid, max, min, setFilter, setValue])

  const dirty = dirtyFields.filters && !!dirtyFields.filters[filterKey]?.length
  const touched = touchedFields.filters && !!touchedFields.filters[filterKey]?.length

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(isNaN(value) || value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const hasFilterData = filterData?.values.length

  if (!searchDataFilters.includes(filterKey) && !hasFilterData) {
    return null
  }

  if (variant === 'min' || variant === 'max') {
    return (
      <details open={!!min || !!max || dirty}>
        <summary>{FilterCategories[filterKey]}</summary>
        <div>
          <div className="single-filter-input">
            <Controller
              control={control}
              name={`filters.${filterKey}.${variant === 'min' ? 0 : 1}`}
              render={({ field }) => (
                <TextField
                  inputMode="numeric"
                  pattern="[0-9]*"
                  label={FilterCategories[filterKey]}
                  hideLabel
                  placeholder={
                    hasFilterData
                      ? variant === 'min'
                        ? filterData.min?.toString()
                        : filterData.max?.toString()
                      : undefined
                  }
                  size="small"
                  {...field}
                  value={field.value || ''}
                  onBlur={(event) => {
                    if (dirty) {
                      setFilter(filterKey, [
                        variant === 'min' ? event.target.value : null,
                        variant === 'max' ? event.target.value : null,
                      ])
                    }
                  }}
                />
              )}
            />
          </div>
        </div>
      </details>
    )
  }

  return (
    <details open={!!min || !!max || dirty || touched}>
      <summary>{FilterCategories[filterKey]}</summary>
      <div>
        <div className="range-filter-input">
          <div>
            <Detail>Min</Detail>
            <Controller
              control={control}
              name={`filters.${filterKey}.0`}
              rules={{ validate: (value) => (min && max ? Number(value) <= max : true) }}
              render={({ field }) => (
                <TextField
                  inputMode="numeric"
                  pattern="[0-9]*"
                  label={`Min. ${FilterCategories[filterKey]}`}
                  hideLabel
                  placeholder={hasFilterData ? filterData.min?.toString() : undefined}
                  size="small"
                  {...field}
                  value={field.value || ''}
                  onBlur={async (event) => {
                    if (dirty) {
                      const valid = await trigger([`filters.${filterKey}.0`])
                      if (valid) {
                        setFilter(filterKey, [event.target.value, max])
                      } else {
                        setFilter(filterKey, [event.target.value, event.target.value])
                        setValue(`filters.${filterKey}`, [event.target.value, event.target.value])
                      }
                    }
                  }}
                />
              )}
            />
          </div>
          <div>
            <Detail>Maks</Detail>
            <Controller
              control={control}
              name={`filters.${filterKey}.1`}
              render={({ field }) => (
                <TextField
                  inputMode="numeric"
                  pattern="[0-9]*"
                  label={`Maks. ${FilterCategories[filterKey]}`}
                  hideLabel
                  placeholder={hasFilterData ? filterData.max?.toString() : undefined}
                  size="small"
                  {...field}
                  value={field.value || ''}
                  onBlur={async (event) => {
                    if (dirty) {
                      const valid = await trigger([`filters.${filterKey}.0`])
                      if (valid) {
                        setFilter(filterKey, [min, event.target.value])
                      } else {
                        setFilter(filterKey, [min, min])
                        setValue(`filters.${filterKey}.1`, min)
                      }
                    }
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
    </details>
  )
}
