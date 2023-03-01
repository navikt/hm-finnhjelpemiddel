import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Button, Search, Switch } from '@navikt/ds-react'
import { Collapse, Delete, Expand } from '@navikt/ds-icons'
import { FilterData, SearchData } from '../../utils/api-util'
import { mapProductSearchParams } from '../../utils/product-util'
import { initialSearchDataState, useHydratedSearchStore } from '../../utils/search-state-util'

import FilterView from './FilterView'
import SelectIsoCategory from './SelectIsoCategory'

const FocusOnResultsButton = () => {
  return (
    <div className="search__focus-on-results">
      <Button variant="secondary" size="small">
        Gå til resultat
      </Button>
    </div>
  )
}

const Sidebar = ({
  filters,
  onResetSearchData,
  setFocus,
}: {
  filters?: FilterData
  onResetSearchData: () => void
  setFocus: () => void
}) => {
  const router = useRouter()
  const { searchData, setSearchData } = useHydratedSearchStore()
  const [productSearchParams] = useState(mapProductSearchParams(router.query))
  const [expanded, setExpanded] = useState(false)

  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...productSearchParams,
    },
  })

  const { control, handleSubmit, reset: resetForm, setValue } = formMethods

  const onSubmit: SubmitHandler<SearchData> = (data) => {
    setFocus()
    setSearchData({ ...data })
  }

  const onReset = () => {
    onResetSearchData()
    resetForm(initialSearchDataState)
  }

  const Chevron = expanded ? Collapse : Expand

  useEffect(() => {
    if (window.innerWidth >= 800) {
      setExpanded(true)
    }
  }, [])

  return (
    <div className="search__side-bar">
      <FormProvider {...formMethods}>
        <form role="search" onSubmit={handleSubmit(onSubmit)} aria-controls="searchResults">
          <div className="search__input">
            <Controller
              render={({ field }) => (
                <Search
                  label="Søk etter produkter"
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
          <FocusOnResultsButton />

          {expanded && (
            <>
              <Switch
                className="search__agreement-switch"
                checked={searchData.hasRammeavtale}
                onChange={(e) => {
                  setValue('hasRammeavtale', e.target.checked, { shouldDirty: true })
                  setSearchData({ hasRammeavtale: e.target.checked })
                }}
              >
                Vis kun produkter på rammeavtale med NAV
              </Switch>

              <SelectIsoCategory />
              <FocusOnResultsButton />

              <FilterView filters={filters} />
            </>
          )}

          <Button
            type="button"
            className="search__reset-button"
            icon={<Delete title="Nullstill søket" />}
            onClick={onReset}
          >
            Nullstill søket
          </Button>
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
