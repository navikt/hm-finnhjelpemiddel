import { SearchData, SelectedFilters } from '@/utils/api-util'
import { FilterCategories } from '@/utils/filter-util'
import { Entries } from '@/utils/type-util'
import { BodyShort, Chips, HStack, Heading, VStack } from '@navikt/ds-react'
import { RefObject } from 'react'
import { useFormContext } from 'react-hook-form'

interface Props {
  selectedFilters: SelectedFilters
  searchTerm: string
  searchFormRef: RefObject<HTMLFormElement>
  withoutHeading?: boolean
}

const ActiveFilters = ({ selectedFilters, searchTerm, searchFormRef, withoutHeading }: Props) => {
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
          {searchTerm && <Chips.Removable>{`Søkeord: ${searchTerm}`}</Chips.Removable>}
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
      <VStack className="spacing-bottom--medium" gap="4">
        <Heading level="2" size="small">
          Valgte filtre
        </Heading>
        {filterValues.length > 0 || searchTerm ? <FilterChips /> : <BodyShort>Ingen filter</BodyShort>}
      </VStack>
    </>
  )
}

export default ActiveFilters
