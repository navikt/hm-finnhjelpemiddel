import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form'

import { Button, Chips, Heading, Switch } from '@navikt/ds-react'

import { FilterData, SearchData, SelectedFilters } from '@/utils/api-util'

import AutocompleteSearch from '@/components/filters/AutocompleteSearch'
import FilterView from '@/components/filters/FilterView'
import { FilterCategories } from '@/utils/filter-util'
import { Entries } from '@/utils/type-util'
import { useSearchParams } from 'next/navigation'

const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => (
  <Button className="visually-hidden-focusable" variant="secondary" size="small" type="button" onClick={setFocus}>
    Gå til resultat
  </Button>
)

type Props = {
  filters?: FilterData
  setFocus?: () => void
  onSubmit: SubmitHandler<SearchData>
  selectedFilters: SelectedFilters
}

const SearchForm = forwardRef<HTMLFormElement, Props>(({ filters, setFocus, onSubmit, selectedFilters }, ref) => {
  const formRef = useRef<HTMLFormElement>(null)
  const formMethods = useFormContext<SearchData>()
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('term') ?? ''

  useImperativeHandle(ref, () => formRef.current!)

  const onSearch = (searchTerm: string) => {
    formMethods.setValue('searchTerm', searchTerm)
    formRef.current?.requestSubmit()
  }

  const filterChips =
    selectedFilters &&
    (Object.entries(selectedFilters) as Entries<SelectedFilters>).flatMap(([key, values]) => ({
      key,
      values,
      label: FilterCategories[key],
    }))

  const filterValues = Object.values(selectedFilters)
    .flat()
    .filter((val) => val)

  return (
    <form
      ref={formRef}
      className="container"
      role="search"
      onSubmit={formMethods.handleSubmit(onSubmit)}
      aria-controls="searchResults"
    >
      <div className="spacing-bottom--medium">
        <Controller
          name="searchTerm"
          control={formMethods.control}
          defaultValue=""
          render={() => <AutocompleteSearch onSearch={onSearch} initialValue={searchTerm} />}
        />
      </div>
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}

      <div className="search__agreement-switch">
        <Controller
          name="hasAgreementsOnly"
          control={formMethods.control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={(event) => {
                formMethods.setValue('hasAgreementsOnly', event.currentTarget.checked)
                formRef.current?.requestSubmit()
              }}
            >
              Vis kun produkter på avtale med NAV
            </Switch>
          )}
        />

        {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      </div>

      {filterChips && filterValues.length > 0 && (
        <>
          <Heading level="2" size="small">
            Valgte filtre
          </Heading>
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
        </>
      )}

      <FilterView filters={filters} />
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
})

export default SearchForm
