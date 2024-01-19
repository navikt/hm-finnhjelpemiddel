import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form'

import { Button, Switch } from '@navikt/ds-react'

import { FilterData, SearchData } from '@/utils/api-util'

import FilterView from './FilterView'
import AutocompleteSearch from './internals/AutocompleteSearch'

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
        <AutocompleteSearch formRef={formRef} />
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
