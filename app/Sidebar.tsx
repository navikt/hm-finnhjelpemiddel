import { Button, Heading, Search } from '@navikt/ds-react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AtLeastOne } from '../utils/type-util'
import { SearchData } from '../utils/api-util'

import Kategorivelger from './Kategorivelger'

type SidebarProps = {
  searchData: SearchData
  setSearchData: (searchData: (prevSearchData: SearchData) => any) => void
}

const Sidebar = ({ searchData, setSearchData }: SidebarProps) => {
  const { control, handleSubmit, register, reset } = useForm<SearchData>()

  const setSearch = (searchData: AtLeastOne<SearchData>) =>
    setSearchData((prevSearchFilters) => ({ ...prevSearchFilters, ...searchData }))

  const setSelectedIsoCode = (isoCode: string) => setSearch({ isoCode })

  const onSubmit: SubmitHandler<SearchData> = (data) => setSearch({ searchTerm: data.searchTerm })

  return (
    <form className="search__side-bar" role="search" onClick={handleSubmit(onSubmit)}>
      <Controller
        render={({ field }) => (
          <Search label="Søk etter produkt" hideLabel={false} className="search__input" {...field} />
        )}
        name="searchTerm"
        control={control}
        defaultValue=""
      />
      <Kategorivelger
        selectedIsoCode={searchData.isoCode}
        setSelectedIsoCode={setSelectedIsoCode}
        register={register}
      />
      <Button
        className="search__reset-button"
        onClick={() => {
          setSelectedIsoCode('')
          reset()
        }}
      >
        Nullstill søket
      </Button>
    </form>
  )
}

export default Sidebar
