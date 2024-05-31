import { Filter } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { FormSearchData } from '@/utils/search-state-util'
import { HStack } from '@navikt/ds-react'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import { Controller, useFormContext } from 'react-hook-form'

const tagFilterCategoriesLabels = {
  vis: 'Vis',
}

type TagFilterKey = keyof typeof tagFilterCategoriesLabels
type Color = 'default' | 'green' | 'blue' | 'orange'
type Props = {
  filterKey: TagFilterKey
  filter: Filter
}

export const TagFilter = ({ filterKey, filter }: Props) => {
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const formMethods = useFormContext<FormSearchData>()

  const selectedFilters = filter?.values?.filter((f) => searchData.filters[filterKey]?.includes(f.key as string)) || []

  const handleFilterClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    field: { value: string[]; onChange: (value: string[]) => void },
    valueKey: string
  ): void => {
    const newValue: string[] = field.value.includes(valueKey)
      ? field.value.filter((key: string) => key !== valueKey)
      : [...field.value, valueKey]
    field.onChange(newValue)
    event.currentTarget?.form?.requestSubmit()
  }

  return (
    <Controller
      control={formMethods.control}
      name={`filters.${filterKey}`}
      render={({ field }) => (
        <HStack gap="2" className="filter-tags spacing-bottom--medium">
          {filter?.values.map((value) => (
            <TagButton
              key={value.key}
              label={value.label || value.key.toString()}
              doc_count={value.doc_count}
              selected={selectedFilters.includes(value)}
              color={
                value.key === 'På avtale'
                  ? 'green'
                  : value.key === 'Ikke på avtale'
                    ? 'blue'
                    : value.key === 'Utgått'
                      ? 'orange'
                      : 'default'
              }
              onClickFunction={(event) => handleFilterClick(event, field, value.key.toString())}
            />
          ))}
        </HStack>
      )}
    />
  )
}

const TagButton = ({
  label,
  doc_count,
  selected,
  color = 'default',
  onClickFunction,
}: {
  label: string
  doc_count: number
  selected: boolean
  color?: Color
  onClickFunction: (event: React.MouseEvent<HTMLButtonElement>) => void
}) => {
  return (
    <button
      className={classNames(
        'filter-tag',
        { 'filter-tag__selected': selected },
        { 'filter-tag__default': color === 'default' },
        { 'filter-tag__green': color === 'green' },
        { 'filter-tag__blue': color === 'blue' },
        { 'filter-tag__orange': color === 'orange' }
      )}
      onClick={onClickFunction}
    >{`${label} (${doc_count})`}</button>
  )
}
