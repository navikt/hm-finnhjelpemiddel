import ShowMore from '@/components/ShowMore'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { FormSearchData } from '@/utils/search-state-util'
import { TrashIcon } from '@navikt/aksel-icons'
import { Button, Detail, HStack, Label, TextField, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type PickedFiltersFormKey =
  | 'setebreddeMaksCM'
  | 'setebreddeMinCM'
  | 'setedybdeMaksCM'
  | 'setedybdeMinCM'
  | 'setehoydeMaksCM'
  | 'setehoydeMinCM'
  | 'breddeMaxCM'
  | 'breddeMinCM'
  | 'lengdeMinCM'
  | 'lengdeMaxCM'
  | 'brukervektMaksKG'
  | 'brukervektMinKG'
  | 'totalVektMaxKG'
  | 'totalVektMinKG'

export type MinMaxGroupFilter = {
  name: string
  filterNameServer?: string
  min: PickedFiltersFormKey
  max: PickedFiltersFormKey
}

type Props = {
  groupTitle: string
  filters: MinMaxGroupFilter[]
}

const RangeFilter = ({ groupTitle, filters }: Props) => {
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const numberOfactiveFiltersInGroup = filters.filter((f) => [f.min, f.max].some((k) => searchData.filters[k].length))

  const showMoreLabel =
    numberOfactiveFiltersInGroup.length > 0 ? `${groupTitle} (${numberOfactiveFiltersInGroup.length})` : `${groupTitle}`

  return (
    <ShowMore
      title={showMoreLabel}
      spacing
      className={classNames('input-filter', { active: numberOfactiveFiltersInGroup.length > 0 })}
    >
      <VStack gap="4">
        {filters.map((filter) => {
          return (
            <VStack key={filter.name} className="range-filter-input-group" gap="2">
              <Label size="small">{filter.name}</Label>
              <FilterMinMaxRow filterKeyMin={filter.min} filterKeyMax={filter.max} />
            </VStack>
          )
        })}
      </VStack>
    </ShowMore>
  )
}

export default RangeFilter

const FilterMinMaxRow = ({
  filterKeyMin,
  filterKeyMax,
}: {
  filterKeyMin: PickedFiltersFormKey
  filterKeyMax: PickedFiltersFormKey
}) => {
  const formMethods = useFormContext<FormSearchData>()

  return (
    <HStack wrap={false} gap="2">
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
            formMethods.setValue(`filters.${filterKeyMin}`, '')
            formMethods.setValue(`filters.${filterKeyMax}`, '')
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

const InputFieldMinMax = ({ inputName, filterKey }: { inputName: 'Min' | 'Max'; filterKey: PickedFiltersFormKey }) => {
  const formMethods = useFormContext<FormSearchData>()

  const rule = { min: 0, max: 99999 }

  return (
    <VStack>
      <Detail>{inputName}</Detail>
      <Controller
        control={formMethods.control}
        name={`filters.${filterKey}`}
        rules={rule}
        render={({ field, fieldState }) => {
          return (
            <TextField
              size="small"
              type="number"
              min={0}
              label={inputName === 'Min' ? 'min' : 'max'}
              data-invalid={fieldState.invalid ? '' : undefined}
              hideLabel
              {...field}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  event.currentTarget?.form?.requestSubmit()
                }
              }}
            />
          )
        }}
      />
    </VStack>
  )
}
