import { forwardRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import classNames from 'classnames'
import { Button, Search, Switch } from '@navikt/ds-react'
import { Collapse, Delete, Expand } from '@navikt/ds-icons'
import { FilterData, SearchData } from '../../utils/api-util'
import { mapProductSearchParams } from '../../utils/product-util'
import { initialSearchDataState, useHydratedSearchStore } from '../../utils/search-state-util'

import FilterView from './FilterView'
import SelectIsoCategory from './SelectIsoCategory'

const Sidebar = ({ filters }: { filters?: FilterData }) => {
  const router = useRouter()
  const { searchData, setSearchData, resetSearchData, meta: searchDataMeta } = useHydratedSearchStore()
  const [productSearchParams] = useState(mapProductSearchParams(router.query))
  const [expanded, setExpanded] = useState(false)

  const { ref: resetButtonRef, inView: isResetButtonVisible } = useInView({ threshold: 0.4 })

  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...productSearchParams,
    },
  })

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset: resetForm,
    setValue,
  } = formMethods

  const onSubmit: SubmitHandler<SearchData> = (data) => setSearchData({ ...data })

  const onReset = () => {
    resetSearchData()
    resetForm(initialSearchDataState)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <form role="search" onSubmit={handleSubmit(onSubmit)}>
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

              <FilterView filters={filters} />
            </>
          )}

          <ResetButton onClick={onReset} ref={resetButtonRef} />

          {(isDirty || searchDataMeta.isUnlikeInitial) && !isResetButtonVisible && (
            <ResetButton fixed onClick={onReset} />
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

const ResetButton = forwardRef<HTMLButtonElement, { onClick: () => void; fixed?: boolean }>(function RButton(
  { onClick, fixed = false },
  ref
) {
  return (
    <Button
      type="button"
      className={classNames({
        'search__reset-button': !fixed,
        'search__reset-button--fixed': fixed,
      })}
      icon={<Delete title="Nullstill søket" />}
      onClick={onClick}
      ref={ref}
    >
      Nullstill søket
    </Button>
  )
})

export default Sidebar
