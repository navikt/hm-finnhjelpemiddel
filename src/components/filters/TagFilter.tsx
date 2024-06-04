import { Filter } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { FormSearchData } from '@/utils/search-state-util'
import { Chips } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { Controller, useFormContext } from 'react-hook-form'

const tagFilterCategoriesLabels = {
  status: 'Status',
}

type TagFilterKey = keyof typeof tagFilterCategoriesLabels
type Color = 'default' | 'green' | 'blue' | 'orange'
type Props = {
  filterKey: TagFilterKey
  filter: Filter
}

export const ChipsFilter = ({ filterKey, filter }: Props) => {
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const formMethods = useFormContext<FormSearchData>()

  const selectedFilters = filter?.values?.filter((f) => searchData.filters[filterKey]?.includes(f.key as string)) || []

  const handleFilterClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    field: { value: string[]; onChange: (value: string[]) => void },
    valueKey: string
  ): void => {
    // Use this to allow mulitple selections
    // const newValue: string[] = field.value.includes(valueKey)
    //   ? field.value.filter((key: string) => key !== valueKey)
    //   : [...field.value, valueKey]
    const newValueOnlyOne = field.value.includes(valueKey) ? [] : [valueKey]
    field.onChange(newValueOnlyOne)
    event.currentTarget?.form?.requestSubmit()
  }

  return (
    <Controller
      control={formMethods.control}
      name={`filters.${filterKey}`}
      render={({ field }) => (
        <Chips className="spacing-bottom--medium">
          {filter?.values.map((value) => (
            <Chips.Toggle
              selected={selectedFilters.includes(value)}
              checkmark={false}
              key={value.key}
              onClick={(event) => handleFilterClick(event, field, value.key.toString())}
            >
              {`${value.label || value.key.toString()} (${value.doc_count})`}
            </Chips.Toggle>
          ))}
        </Chips>
      )}
    />
  )
}
