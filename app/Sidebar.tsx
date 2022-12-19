import { Button, Search } from '@navikt/ds-react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { SearchData } from '../utils/api-util'

import Kategorivelger from './Kategorivelger'
import FilterView from './FilterView'
import { useSearchDataStore } from '../utils/state-util'

const Sidebar = () => {
  const { setSearchData, resetSearchData } = useSearchDataStore()
  const formMethods = useForm<SearchData>()
  const { control, handleSubmit, reset: resetForm } = formMethods

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
        <Kategorivelger />
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
