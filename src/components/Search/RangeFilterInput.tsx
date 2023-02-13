import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { Button, Detail, ErrorMessage, TextField } from '@navikt/ds-react'
import { FilterData, SearchData, SelectedFilters } from '../../utils/api-util'
import { useSearchDataStore } from '../../utils/state-util'
import { FilterCategories } from './FilterView'

import '../styles/range-filter-input.scss'

type RangeFilterInputProps = {
  filterKey: keyof typeof FilterCategories
  filters?: FilterData
  className?: string
}

export const RangeFilterInput = ({ filterKey, filters, className }: RangeFilterInputProps) => {
  const { searchData } = useSearchDataStore()
  const {
    formState: { errors, dirtyFields },
    register,
    watch,
  } = useFormContext<SearchData>()

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) =>
      values.some((value) => !(isNaN(value) || value === null || value === undefined))
    )
    .reduce((newObject, [key, values]) => ({ ...newObject, [key]: values }), {} as SelectedFilters)

  const [min, max] = watch(`filters.${filterKey}`) || []
  const dirty = dirtyFields.filters && !!dirtyFields.filters[filterKey]?.length

  const hasFilterData = filters && filters[filterKey]?.values.length

  if (!(filterKey in searchDataFilters) && !hasFilterData) {
    return null
  }

  return (
    <div className={classNames('range-filter', className)}>
      <details open={!!min || !!max || dirty}>
        <summary>{FilterCategories[filterKey]}</summary>
        <div className="range-filter__input">
          <div>
            <Detail>Min</Detail>
            <TextField
              type="number"
              label={`Min. ${FilterCategories[filterKey]}`}
              hideLabel
              placeholder={hasFilterData ? filters[filterKey].min?.toString() : undefined}
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
              placeholder={hasFilterData ? filters[filterKey].max?.toString() : undefined}
              {...register(`filters.${filterKey}.1`, { valueAsNumber: true })}
            />
          </div>
          <div>
            <Button type="submit">Søk</Button>
          </div>
        </div>
        {errors.filters && errors.filters[filterKey] && (
          <ErrorMessage className="range-filter__error" size="small">
            Min-verdien må være lavere enn Maks-verdien
          </ErrorMessage>
        )}
      </details>
    </div>
  )
}
