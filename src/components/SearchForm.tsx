import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form'

import { Button, Search, Switch } from '@navikt/ds-react'

import { FilterData, SearchData } from '@/utils/api-util'
import { initialSearchDataState, useHydratedSearchStore } from '@/utils/search-state-util'

import FilterView from './sidebar/FilterView'

const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => (
  <Button className="visually-hidden-focusable" variant="secondary" size="small" type="button" onClick={setFocus}>
    Gå til resultat
  </Button>
)

export type SearchFormResetHandle = {
  reset: () => void
}

type Props = {
  filters?: FilterData
  setFocus?: () => void
}

const SearchForm = forwardRef<SearchFormResetHandle, Props>(({ filters, setFocus }, ref) => {
  const { searchData, setSearchData } = useHydratedSearchStore()
  const { control, handleSubmit, reset: resetForm, setValue } = useFormContext<SearchData>()

  const onSubmit: SubmitHandler<SearchData> = (data) => setSearchData({ ...data })

  useEffect(() => {
    setValue('searchTerm', searchData.searchTerm)
  }, [searchData.searchTerm, setValue])

  useImperativeHandle(ref, () => ({
    reset() {
      resetForm(initialSearchDataState)
    },
  }))

  return (
    <form className="container" role="search" onSubmit={handleSubmit(onSubmit)} aria-controls="searchResults">
      <div className="spacing-bottom--medium">
        <Controller
          render={({ field }) => (
            <Search
              label="Skriv ett eller flere søkeord"
              hideLabel={false}
              onClear={() => setSearchData({ searchTerm: '' })}
              {...field}
            />
          )}
          name="searchTerm"
          control={control}
          defaultValue=""
        />
      </div>
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}

      <div className="search__agreement-switch">
        <Switch
          checked={searchData.hasAgreementsOnly}
          onChange={(e) => {
            setValue('hasAgreementsOnly', e.target.checked, { shouldDirty: true })
            setSearchData({ hasAgreementsOnly: e.target.checked })
          }}
        >
          Vis kun produkter på avtale med NAV
        </Switch>
        {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      </div>

      <FilterView filters={filters} />
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
    </form>
  )
})

export default SearchForm
