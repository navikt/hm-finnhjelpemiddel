import { Filter, SearchData } from '@/utils/api-util'
import { FilterCategories } from '@/utils/filter-util'
import { Detail, TextField } from '@navikt/ds-react'
import { useEffect, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import ShowMore from '@/components/ShowMore'
import { mapSearchParams } from '@/utils/product-util'
import { useSearchParams } from 'next/navigation'

type FilterProps = {
  filter: { key: keyof typeof FilterCategories; data?: Filter }
  variant?: 'min-max' | 'min' | 'max'
}

export const RangeFilterInput = ({ filter, variant = 'min-max' }: FilterProps) => {
  const { key: filterKey, data: filterData } = filter
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const formMethods = useFormContext<SearchData>()

  const [min, max] = formMethods.watch(`filters.${filterKey}`) || []
  const numberOfActiveFilters = searchData.filters[filterKey].length

  useEffect(() => {
    if (formMethods.formState.isSubmitting && !formMethods.formState.isValid) {
      const maxValue = Math.max(min, max)
      formMethods.setValue(`filters.${filterKey}`, [maxValue, maxValue])
    }
  }, [formMethods, filterKey, min, max])

  const dirty =
    formMethods.formState.dirtyFields.filters && !!formMethods.formState.dirtyFields.filters[filterKey]?.length
  const touched =
    formMethods.formState.touchedFields.filters && !!formMethods.formState.touchedFields.filters[filterKey]?.length

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(isNaN(value) || value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const hasFilterData = filterData?.values.length

  if (!searchDataFilters.includes(filterKey) && !hasFilterData) {
    return null
  }

  if (variant === 'min' || variant === 'max') {
    return (
      <ShowMore title={FilterCategories[filterKey]} open={!!min || !!max || dirty} spacing className="input-filter">
        <div className="single-filter-input">
          <Controller
            control={formMethods.control}
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
                    formMethods.setValue(
                      `filters.${filterKey}`,
                      variant === 'min' ? [event.target.value, null] : [null, event.target.value]
                    )
                    event.target?.form?.requestSubmit()
                  }
                }}
              />
            )}
          />
        </div>
      </ShowMore>
    )
  }

  return (
    <ShowMore
      title={FilterCategories[filterKey]}
      open={!!min || !!max || dirty || touched}
      spacing
      className="input-filter"
    >
      <div className="range-filter-input">
        <div>
          <Detail>Min</Detail>
          <Controller
            control={formMethods.control}
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
                    const valid = await formMethods.trigger([`filters.${filterKey}.0`])
                    if (valid) {
                      formMethods.setValue(`filters.${filterKey}`, [event.target.value, max])
                    } else {
                      formMethods.setValue(`filters.${filterKey}`, [event.target.value, null])
                    }
                    event.target.form?.requestSubmit()
                  }
                }}
              />
            )}
          />
        </div>
        <div>
          <Detail>Maks</Detail>
          <Controller
            control={formMethods.control}
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
                    const valid = await formMethods.trigger([`filters.${filterKey}.0`])
                    if (valid) {
                      formMethods.setValue(`filters.${filterKey}`, [min, event.target.value])
                    } else {
                      formMethods.setValue(`filters.${filterKey}`, [min, min])
                    }
                    event.target?.form?.requestSubmit()
                  }
                }}
              />
            )}
          />
        </div>
      </div>
    </ShowMore>
  )
}
