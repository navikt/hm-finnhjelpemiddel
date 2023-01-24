import { Button, Fieldset, Search, Switch } from '@navikt/ds-react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FilterData, SearchData } from '../utils/api-util'
import { initialSearchDataState, useSearchDataStore } from '../utils/state-util'

import SelectIsoCategory from './SelectIsoCategory'
import FilterView from './FilterView'
import { useEffect, useState } from 'react'
import { Collapse, Delete, Expand } from '@navikt/ds-icons'

const Sidebar = ({ filters }: { filters?: FilterData }) => {
  const { searchData, setSearchData, resetSearchData } = useSearchDataStore()
  const formMethods = useForm<SearchData>({
    defaultValues: initialSearchDataState,
  })
  const [expanded, setExpanded] = useState(false)

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset: resetForm,
    setValue,
    watch,
  } = formMethods

  watch(({ hasRammeavtale }) => setSearchData({ hasRammeavtale: !!hasRammeavtale }))

  const onSubmit: SubmitHandler<SearchData> = (data) => setSearchData({ ...data })

  const Chevron = expanded ? Collapse : Expand

  useEffect(() => {
    if (window.innerWidth >= 800) {
      setExpanded(true)
    }
  }, [])

  return (
    <div className="search__side-bar">
      <FormProvider {...formMethods}>
        <form role="search" onSubmit={handleSubmit(onSubmit)}>
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

          {expanded && (
            <>
              <SelectIsoCategory />

              <Fieldset
                legend="Rammeavtale"
                description="Dersom denne er huket av så vises kun produkter som er på aktiv rammeavtale med Nav."
              >
                <Switch
                  checked={searchData.hasRammeavtale}
                  onChange={(e) => setValue('hasRammeavtale', e.target.checked, { shouldDirty: true })}
                >
                  På rammeavtale
                </Switch>
              </Fieldset>

              <FilterView filters={filters} />
            </>
          )}

          {isDirty && (
            <Button
              type="button"
              className="search__reset-button"
              icon={<Delete title="Nullstill søket" />}
              onClick={() => {
                resetSearchData()
                resetForm()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              Nullstill søket
            </Button>
          )}
        </form>
      </FormProvider>
      <Button
        type="button"
        className="search__expand-button "
        variant="tertiary"
        icon={<Chevron title="Vis mer informasjon om produktet" />}
        onClick={() => setExpanded((prevState) => !prevState)}
      >
        {expanded ? 'Vis færre filtre' : 'Vis alle filtre'}
      </Button>
    </div>
  )
}

export default Sidebar
