import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { Button, Detail, ErrorMessage, TextField } from '@navikt/ds-react'
import { FilterData, SearchData } from '../utils/api-util'
import { FilterCategories } from './FilterView'

import '../styles/range-filter-input.scss'

type RangeFilterInputProps = { filterKey: keyof typeof FilterCategories; filters: FilterData; className?: string }

export const RangeFilterInput = ({ filterKey, filters, className }: RangeFilterInputProps) => {
  const {
    formState: { errors, dirtyFields },
    register,
    watch,
  } = useFormContext<SearchData>()

  const [min, max] = watch(`filters.${filterKey}`) || []
  const dirty = dirtyFields.filters && !!dirtyFields.filters[filterKey]?.length

  if (!(filterKey in filters)) {
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
              placeholder={filters[filterKey].min?.toString()}
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
              placeholder={filters[filterKey].max?.toString()}
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
