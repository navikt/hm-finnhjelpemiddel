import { SearchData, SelectedFilters } from '@/utils/api-util'
import { FilterCategories } from '@/utils/filter-util'
import { Entries } from '@/utils/type-util'
import { Chips, HStack, Heading, VStack } from '@navikt/ds-react'
import { RefObject } from 'react'
import { useFormContext } from 'react-hook-form'

interface Props {
  selectedFilters: SelectedFilters
  searchFormRef: RefObject<HTMLFormElement>
  withoutHeading?: boolean
}

const ActiveFilters = ({ selectedFilters, searchFormRef, withoutHeading }: Props) => {
  const formMethods = useFormContext<SearchData>()
  const filterChips = (Object.entries(selectedFilters) as Entries<SelectedFilters>).flatMap(([key, values]) => ({
    key,
    values,
    label: FilterCategories[key],
  }))
  const filterValues = Object.values(selectedFilters)
    .flat()
    .filter((val) => val)

  const FilterChips = () => {
    return (
      <HStack gap="12">
        <Chips>
          {filterChips.map(({ key, label, values }) => {
            return values
              .filter((v) => v)
              .map((value) => {
                return (
                  <Chips.Removable
                    key={key + value}
                    onClick={() => {
                      formMethods.setValue(
                        `filters.${key}`,
                        values.filter((val) => val !== value)
                      )
                      searchFormRef.current?.requestSubmit()
                    }}
                  >
                    {label === FilterCategories.produktkategori ? value : `${label}: ${value}`}
                  </Chips.Removable>
                )
              })
          })}
        </Chips>
      </HStack>
    )
  }

  if (withoutHeading) {
    return <FilterChips />
  }
  return (
    <>
      {filterValues.length > 0 && (
        <VStack className="search__active-filter-container" gap="4">
          <Heading level="2" size="small">
            Valgte filtre
          </Heading>
          <FilterChips />
        </VStack>
      )}
    </>
  )
}

export default ActiveFilters
