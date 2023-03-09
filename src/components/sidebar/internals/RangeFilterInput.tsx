import { useFormContext } from 'react-hook-form'
import { Button, Detail, ErrorMessage, TextField } from '@navikt/ds-react'
import { Filter, SearchData } from '../../../utils/api-util'
import { FilterCategories } from '../../../utils/filter-util'
import { useHydratedSearchStore } from '../../../utils/search-state-util'

type RangeFilterInputProps = {
  filter: { key: keyof typeof FilterCategories; data?: Filter }
}

export const RangeFilterInput = ({ filter }: RangeFilterInputProps) => {
  const { key: filterKey, data: filterData } = filter

  const { searchData } = useHydratedSearchStore()
  const {
    formState: { errors, dirtyFields },
    register,
    watch,
  } = useFormContext<SearchData>()

  const [min, max] = watch(`filters.${filterKey}`) || []
  const dirty = dirtyFields.filters && !!dirtyFields.filters[filterKey]?.length

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(isNaN(value) || value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const hasFilterData = filterData?.values.length

  if (!searchDataFilters.includes(filterKey) && !hasFilterData) {
    return null
  }

  return (
    <details open={!!min || !!max || dirty}>
      <summary>{FilterCategories[filterKey]}</summary>
      <div>
        <div className="range-filter-input">
          <div>
            <Detail>Min</Detail>
            <TextField
              type="number"
              label={`Min. ${FilterCategories[filterKey]}`}
              hideLabel
              placeholder={hasFilterData ? filterData.min?.toString() : undefined}
              size="small"
              {...register(`filters.${filterKey}.0`, {
                valueAsNumber: true,
                validate: (value) => (min && max ? value <= max : true),
              })}
            />
          </div>
          <div>
            <Detail>Maks</Detail>
            <TextField
              type="number"
              label={`Maks. ${FilterCategories[filterKey]}`}
              hideLabel
              placeholder={hasFilterData ? filterData.max?.toString() : undefined}
              size="small"
              {...register(`filters.${filterKey}.1`, { valueAsNumber: true })}
            />
          </div>
          <div>
            <Button type="submit" size="small">
              Søk
            </Button>
          </div>
        </div>
        {errors.filters && errors.filters[filterKey] && (
          <ErrorMessage className="range-filter-input__error" size="small">
            Min-verdien må være lavere enn Maks-verdien
          </ErrorMessage>
        )}
      </div>
    </details>
  )
}
