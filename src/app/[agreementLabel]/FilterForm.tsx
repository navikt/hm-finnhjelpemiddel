import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form'

import { BodyShort, Button, Chips, Label, VStack } from '@navikt/ds-react'

import { FilterData, SelectedFilters } from '@/utils/api-util'

import { FilterCategories } from '@/utils/filter-util'
import { Entries } from '@/utils/type-util'
import { useSearchParams } from 'next/navigation'
import FilterView from '../sok/sidebar/FilterView'
import AutocompleteSearch from '../sok/sidebar/internals/AutocompleteSearch'
import { AgreementSearchData } from './AgreementSearch'

const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => (
  <Button className="visually-hidden-focusable" variant="secondary" size="small" type="button" onClick={setFocus}>
    Gå til resultat
  </Button>
)

type Props = {
  filters?: FilterData
  selectedFilters?: SelectedFilters
  setFocus?: () => void
  onSubmit: SubmitHandler<AgreementSearchData>
}

const FilterForm = forwardRef<HTMLFormElement, Props>(({ filters, selectedFilters, setFocus, onSubmit }, ref) => {
  const formRef = useRef<HTMLFormElement>(null)
  const formMethods = useFormContext<AgreementSearchData>()
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('term') ?? ''

  useImperativeHandle(ref, () => formRef.current!)

  const onSearch = (searchTerm: string) => {
    formMethods.setValue('searchTerm', searchTerm)
    formRef.current?.requestSubmit()
  }

  const filterValues = filters
    ? Object.values(filters)
        .flat()
        .filter((val) => val)
    : []

  const filterChips = selectedFilters
    ? (Object.entries(selectedFilters) as Entries<SelectedFilters>).flatMap(([key, values]) => ({
        key,
        values,
        label: FilterCategories[key],
      }))
    : []

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={formMethods.handleSubmit(onSubmit)}
      aria-controls="agreementSearchResults"
    >
      <div className="spacing-bottom--medium">
        <Controller
          name="searchTerm"
          control={formMethods.control}
          defaultValue=""
          render={() => <AutocompleteSearch onSearch={onSearch} initialValue={searchTerm} />}
        />
      </div>
      <VStack gap="2" className="spacing-bottom--medium">
        <Label>Valgte filtre</Label>
        {filterValues.length === 0 && <BodyShort>Ingen filter</BodyShort>}
        {filterValues.length > 0 && (
          <Chips className="results__chips">
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
                        formRef.current?.requestSubmit()
                      }}
                    >
                      {label === FilterCategories.produktkategori ? value : `${label}: ${value}`}
                    </Chips.Removable>
                  )
                })
            })}
          </Chips>
        )}
      </VStack>
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}

      <FilterView filters={filters} />
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
})

export default FilterForm
