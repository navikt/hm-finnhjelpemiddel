import { useCallback } from 'react'
import { Button, Search } from '@navikt/ds-react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { AtLeastOne } from '../utils/type-util'
import { SearchData } from '../utils/api-util'

import Kategorivelger from './Kategorivelger'
import FilterView from './FilterView'

type SidebarProps = {
  searchData: SearchData
  setSearchData: (searchData: (prevSearchData: SearchData) => any) => void
}

const Sidebar = ({ searchData, setSearchData }: SidebarProps) => {
  const formMethods = useForm<SearchData>()
  const { control, handleSubmit, register, reset } = formMethods

  const setSearch = useCallback(
    (searchData: AtLeastOne<SearchData>) =>
      setSearchData((prevSearchFilters) => ({ ...prevSearchFilters, ...searchData })),
    [setSearchData]
  )

  const setSelectedIsoCode = (isoCode: string) => setSearch({ isoCode })

  const onSubmit: SubmitHandler<SearchData> = (data) => setSearch({ ...searchData, ...data })

  return (
    <FormProvider {...formMethods}>
      <form className="search__side-bar" role="search" onSubmit={handleSubmit(onSubmit)}>
        <div className="search__input">
          <Controller
            render={({ field }) => (
              <Search
                label="Søk etter produkt"
                hideLabel={false}
                onClear={() => setSearch({ searchTerm: '' })}
                {...field}
              />
            )}
            name="searchTerm"
            control={control}
            defaultValue=""
          />
        </div>
        <Kategorivelger
          selectedIsoCode={searchData.isoCode}
          setSelectedIsoCode={setSelectedIsoCode}
          register={register}
        />
        <FilterView />
        <Button
          type="button"
          className="search__reset-button"
          onClick={() => {
            setSelectedIsoCode('')
            reset()
          }}
        >
          Nullstill søket
        </Button>
      </form>
    </FormProvider>
  )
}

export default Sidebar
