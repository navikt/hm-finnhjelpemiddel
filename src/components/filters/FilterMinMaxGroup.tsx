import React, { useMemo } from 'react'
import { Label, HStack, VStack, Detail, TextField, Button } from '@navikt/ds-react'
import ShowMore from '@/components/ShowMore'
import { Controller, useFormContext } from 'react-hook-form'
import { FormSearchData } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/product-util'
import { useSearchParams } from 'next/navigation'
import { NewFiltersFormKey } from '@/utils/filter-util'
import classNames from 'classnames'
import { TrashIcon } from '@navikt/aksel-icons'

export type MinMaxGroupFilter = {
  name: string
  filterNameServer?: string
  min: NewFiltersFormKey
  max: NewFiltersFormKey
}

type Props = {
  groupTitle: string
  filters: MinMaxGroupFilter[]
}

const FilterMinMaxGroup = ({ groupTitle, filters }: Props) => {
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const numberOfactiveFiltersInGroup = filters.filter((f) =>
    [f.min, f.max].some((k) => searchData.newFilters[k].length)
  )

  const showMoreLabel =
    numberOfactiveFiltersInGroup.length > 0 ? `${groupTitle} (${numberOfactiveFiltersInGroup.length})` : `${groupTitle}`

  return (
    <ShowMore
      title={showMoreLabel}
      spacing
      className={classNames('input-filter', { active: numberOfactiveFiltersInGroup.length > 0 })}
    >
      <VStack gap="4">
        {filters.map((filter) => (
          <VStack key={filter.name} gap="2">
            <Label size="small">{filter.name}</Label>
            <FilterMinMaxRow filterKeyMin={filter.min} filterKeyMax={filter.max} />
          </VStack>
        ))}
      </VStack>
    </ShowMore>
  )
}

export default FilterMinMaxGroup

const FilterMinMaxRow = ({
  filterKeyMin,
  filterKeyMax,
}: {
  filterKeyMin: NewFiltersFormKey
  filterKeyMax: NewFiltersFormKey
}) => {
  const formMethods = useFormContext<FormSearchData>()

  return (
    <HStack className="range-filter-input-group" wrap={false} gap="2">
      <InputFieldMinMax inputName="Min" filterKey={filterKeyMin} />
      <InputFieldMinMax inputName="Max" filterKey={filterKeyMax} />
      <HStack gap="2">
        <Button
          size="small"
          type="button"
          variant="secondary"
          onClick={(event) => {
            event.currentTarget?.form?.requestSubmit()
          }}
        >
          Søk
        </Button>
        <Button
          onClick={(event) => {
            formMethods.setValue(`newFilters.${filterKeyMin}`, '')
            formMethods.setValue(`newFilters.${filterKeyMax}`, '')
            event.currentTarget?.form?.requestSubmit()
          }}
          size="small"
          variant="secondary"
          icon={<TrashIcon title="Fjern filter" fontSize="1.5rem" />}
        />
      </HStack>
    </HStack>
  )
}

const InputFieldMinMax = ({ inputName, filterKey }: { inputName: 'Min' | 'Max'; filterKey: NewFiltersFormKey }) => {
  const formMethods = useFormContext<FormSearchData>()

  const rule = inputName === 'Min' ? { min: 0 } : { max: 99999 }
  return (
    <VStack>
      <Detail>{inputName}</Detail>
      <Controller
        control={formMethods.control}
        name={`newFilters.${filterKey}`}
        rules={rule}
        render={({ field, fieldState }) => {
          return (
            <TextField
              size="small"
              type="number"
              label={inputName === 'Min' ? 'min' : 'max'}
              data-invalid={fieldState.invalid ? '' : undefined}
              hideLabel
              {...field}
            />
          )
        }}
      />
    </VStack>
  )
}
