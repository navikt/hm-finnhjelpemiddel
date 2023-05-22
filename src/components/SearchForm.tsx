import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Button, Search, Switch } from '@navikt/ds-react'
import { FilterData, SearchData } from '@/utils/api-util'
import { initialSearchDataState, useHydratedSearchStore } from '@/utils/search-state-util'
import { mapProductSearchParams } from '@/utils/product-util'

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
  const router = useRouter()

  const { searchData, setSearchData } = useHydratedSearchStore()
  const [productSearchParams] = useState(mapProductSearchParams(router.query))

  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...productSearchParams,
    },
  })

  const { control, handleSubmit, reset: resetForm, setValue } = formMethods

  const onSubmit: SubmitHandler<SearchData> = (data) => setSearchData({ ...data })

  useImperativeHandle(ref, () => ({
    reset() {
      resetForm(initialSearchDataState)
    },
  }))

  return (
    <FormProvider {...formMethods}>
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
            checked={searchData.hasRammeavtale}
            onChange={(e) => {
              setValue('hasRammeavtale', e.target.checked, { shouldDirty: true })
              setSearchData({ hasRammeavtale: e.target.checked })
            }}
          >
            Vis kun produkter på rammeavtale med NAV
          </Switch>
          {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
        </div>

        <FilterView filters={filters} />
        {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      </form>
    </FormProvider>
  )
})

export default SearchForm
