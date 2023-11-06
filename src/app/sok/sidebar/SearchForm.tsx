import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form'

import { useSearchParams } from 'next/navigation'

import { Button, Search, Switch } from '@navikt/ds-react'

import { FilterData, SearchData } from '@/utils/api-util'

import FilterView from './FilterView'

const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => (
  <Button className="visually-hidden-focusable" variant="secondary" size="small" type="button" onClick={setFocus}>
    Gå til resultat
  </Button>
)

type Props = {
  filters?: FilterData
  setFocus?: () => void
  onSubmit: SubmitHandler<SearchData>
}

const SearchForm = forwardRef<HTMLFormElement, Props>(({ filters, setFocus, onSubmit }, ref) => {
  const formRef = useRef<HTMLFormElement>(null)
  const searchParams = useSearchParams()
  const formMethods = useFormContext<SearchData>()

  useImperativeHandle(ref, () => formRef.current!)

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
          render={({ field }) => (
            <Search
              {...field}
              label="Skriv ett eller flere søkeord"
              hideLabel={false}
              onSearchClick={(searchTerm) => {
                formMethods.setValue('searchTerm', searchTerm)
                formRef.current?.requestSubmit()
              }}
              onClear={() => {
                formMethods.setValue('searchTerm', '')
                formRef.current?.requestSubmit()
              }}
            />
          )}
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

      <FilterView filters={filters} />
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
})

export default SearchForm
