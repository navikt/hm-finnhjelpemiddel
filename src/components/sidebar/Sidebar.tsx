import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Button, Heading, Popover, Search, Switch } from '@navikt/ds-react'
import { Collapse, Delete, Expand } from '@navikt/ds-icons'
import { FilesIcon } from '@navikt/aksel-icons'
import { FilterData, SearchData } from '../../utils/api-util'
import { mapProductSearchParams } from '../../utils/product-util'
import { initialSearchDataState, useHydratedSearchStore } from '../../utils/search-state-util'

import FilterView from './FilterView'
import SelectIsoCategory from './SelectIsoCategory'

const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => (
  <Button className="visually-hidden-focusable" variant="secondary" size="small" type="button" onClick={setFocus}>
    Gå til resultat
  </Button>
)

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

  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)

  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...productSearchParams,
    },
  })

  const { control, handleSubmit, reset: resetForm, setValue } = formMethods

  const onSubmit: SubmitHandler<SearchData> = (data) => {
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
    <section className="search__side-bar">
      <FormProvider {...formMethods}>
        <form className="container" role="search" onSubmit={handleSubmit(onSubmit)} aria-controls="searchResults">
          <Heading level="2" size="medium" spacing>
            Søk
          </Heading>
          <Controller
            render={({ field }) => (
              <Search
                className="search__input"
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
          <FocusOnResultsButton setFocus={setFocus} />

          {expanded && (
            <>
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
                <FocusOnResultsButton setFocus={setFocus} />
              </div>

              <SelectIsoCategory />
              <FocusOnResultsButton setFocus={setFocus} />

              <FilterView filters={filters} />
              <FocusOnResultsButton setFocus={setFocus} />
            </>
          )}
        </form>
      </FormProvider>
      <div className="search__expand-container">
        <Button
          type="button"
          variant="tertiary"
          icon={<Chevron title="Vis mer informasjon om produktet" />}
          onClick={() => setExpanded((prevState) => !prevState)}
        >
          {expanded ? 'Vis færre filtre' : 'Vis alle filtre'}
        </Button>
      </div>
      <div className="footer">
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            ref={copyButtonRef}
            variant="tertiary"
            size="small"
            icon={<FilesIcon title="Kopiér søket til utklippstavlen" />}
            onClick={() => {
              navigator.clipboard.writeText(location.href)
              setCopyPopupOpenState(true)
            }}
          >
            Kopiér søket
          </Button>
          <Popover
            open={copyPopupOpenState}
            onClose={() => setCopyPopupOpenState(false)}
            anchorEl={copyButtonRef.current}
            placement="right"
          >
            <Popover.Content>Søket er kopiert!</Popover.Content>
          </Popover>
        </div>
        <Button
          type="button"
          variant="tertiary"
          size="small"
          // className="search__reset-button"
          icon={<Delete title="Nullstill søket" />}
          onClick={onReset}
        >
          Nullstill søket
        </Button>
      </div>
    </section>
  )
}

export default Sidebar
