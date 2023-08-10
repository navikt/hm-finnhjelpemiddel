import React, { forwardRef, useImperativeHandle } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { useSearchParams } from 'next/navigation'

import { Button, Switch } from '@navikt/ds-react'

import { FilterData, SearchData } from '@/utils/api-util'
import { initialSearchDataState, useHydratedSearchStore } from '@/utils/search-state-util'

import SearchCombobox from './internals/SearchCombobox'

import FilterView from './FilterView'

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
  const searchParams = useSearchParams()
  const { searchData, setSearchData } = useHydratedSearchStore()
  const { handleSubmit, reset: resetForm, setValue } = useFormContext<SearchData>()

  const onSubmit: SubmitHandler<SearchData> = (data) => {
    setSearchData({ ...data })
  }

  useImperativeHandle(ref, () => ({
    reset() {
      resetForm(initialSearchDataState)
    },
  }))

  return (
    <form className="container" role="search" onSubmit={handleSubmit(onSubmit)} aria-controls="searchResults">
      <div className="spacing-bottom--medium">
        <SearchCombobox
          initialValue={searchParams.get('term') || ''}
          onSearch={(searchTerm) => {
            setSearchData({ ...searchData, searchTerm })
          }}
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
