import { Button, Fieldset, Search, Switch } from '@navikt/ds-react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { SearchData } from '../utils/api-util'

import SelectIsoCategory from './SelectIsoCategory'
import FilterView from './FilterView'
import { useSearchDataStore } from '../utils/state-util'

const Sidebar = () => {
  const { setSearchData, resetSearchData } = useSearchDataStore()
  const formMethods = useForm<SearchData>()
  const { control, handleSubmit, reset: resetForm, setValue, watch } = formMethods

  watch(({ hasRammeavtale }) => setSearchData({ hasRammeavtale: !!hasRammeavtale }))

  const onSubmit: SubmitHandler<SearchData> = (data) => {
    setSearchData({ ...data })
  }

  return (
    <FormProvider {...formMethods}>
      <form className="search__side-bar" role="search" onSubmit={handleSubmit(onSubmit)}>
        <div className="search__input">
          <Controller
            render={({ field }) => (
              <Search
                label="Søk etter produkt"
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
        <SelectIsoCategory />

        <Fieldset
          legend="Rammeavtale"
          description="Dersom denne er huket av så vises kun produkter som er på aktiv rammeavtale med Nav."
        >
          <Switch defaultChecked onChange={(e) => setValue('hasRammeavtale', e.target.checked)}>
            På rammeavtale
          </Switch>
        </Fieldset>

        <FilterView />
        <Button
          type="button"
          className="search__reset-button"
          onClick={() => {
            resetSearchData()
            resetForm()
          }}
        >
          Nullstill søket
        </Button>
      </form>
    </FormProvider>
  )
}

export default Sidebar
