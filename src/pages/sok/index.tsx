import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { FormProvider, useForm } from 'react-hook-form'
import { InferGetServerSidePropsType, NextPageContext } from 'next'
import Router, { useRouter } from 'next/router'
import useSWRInfinite from 'swr/infinite'
import { Button, Chips, Heading, Popover } from '@navikt/ds-react'
import { Delete, Up } from '@navikt/ds-icons'
import { FilesIcon } from '@navikt/aksel-icons'
import { initialSearchDataState, useHydratedSearchStore } from '@/utils/search-state-util'
import { CompareMode, useHydratedCompareStore } from '@/utils/compare-state-util'
import { fetchProducts, FetchResponse, PAGE_SIZE, SearchData, SearchParams, SelectedFilters } from '@/utils/api-util'
import { mapProductSearchParams, toSearchQueryString } from '@/utils/product-util'
import { FilterCategories } from '@/utils/filter-util'
import { Entries } from '@/utils/type-util'

import AnimateLayout from '@/components/layout/AnimateLayout'
import CompareMenu from '@/components/compare-products/CompareMenu'
import MobileOverlay from '@/components/MobileOverlay'
import SearchForm, { SearchFormResetHandle } from '@/components/SearchForm'
import SearchResults from '@/components/search/SearchResults'
import Sidebar from '@/components/sidebar/Sidebar'

export const getServerSideProps: (
  context: NextPageContext
) => Promise<{ props: { searchParams: SearchParams } }> = async (context: NextPageContext) => {
  const { query } = context
  return { props: { searchParams: mapProductSearchParams(query) } }
}

export default function Home({ searchParams }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<SearchFormResetHandle>(null)

  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const {
    searchData,
    setFilter,
    setSearchData,
    meta: { showProductSeriesView },
  } = useHydratedSearchStore()
  const { compareMode } = useHydratedCompareStore()
  const [productSearchParams] = useState(mapProductSearchParams(router.query))

  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...productSearchParams,
    },
  })

  const { setValue } = formMethods

  const [initialProductSearchParams, setInitialProductSearchParams] = useState(searchParams)
  const [searchInitialized, setSearchInitialized] = useState(false)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)

  const { data, size, setSize, isLoading } = useSWRInfinite<FetchResponse>(
    (index) => {
      const from = index !== 0 ? (initialProductSearchParams.to || PAGE_SIZE) + (index - 1) * PAGE_SIZE : 0
      const to = (index === 0 && initialProductSearchParams.to) || PAGE_SIZE
      return {
        from,
        to,
        searchData,
        isProductSeriesView: showProductSeriesView,
      }
    },
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

  const { ref: pageTopRef, inView: isAtPageTop } = useInView({ threshold: 0.4 })
  const productViewToggleRef = useRef<HTMLButtonElement>(null)

  const setFocusOnSearchResults = () => {
    productViewToggleRef.current && productViewToggleRef.current.focus()
  }

  useEffect(() => setSearchData(initialProductSearchParams), [initialProductSearchParams, setSearchData])

  useEffect(() => {
    if (data) {
      setSearchInitialized(true)
    }
  }, [data])

  const products = data?.flatMap((d) => d.products)
  const numberOfFetchedProducts = products && products.length > PAGE_SIZE ? products.length : undefined
  const totalNumberOfProducts = data?.at(-1)?.numberOfProducts

  useEffect(() => {
    if (searchInitialized) {
      Router.push(
        toSearchQueryString({
          ...searchData,
          to: numberOfFetchedProducts,
        }),
        undefined,
        {
          scroll: false,
          shallow: true,
        }
      )
    }
  }, [searchInitialized, searchData, numberOfFetchedProducts])

  useEffect(() => {
    setShowSidebar(window.innerWidth >= 1100)
    window.addEventListener('resize', () => setShowSidebar(window.innerWidth >= 1100))
  }, [])

  const onReset = () => {
    setInitialProductSearchParams({ ...initialSearchDataState, to: undefined })
    setSize(1)
  }

  const filterValues = Object.values(searchData.filters)
    .flat()
    .filter((val) => val)

  const filterChips = (Object.entries(searchData.filters) as Entries<SelectedFilters>).flatMap(([key, values]) => ({
    key,
    values,
    label: FilterCategories[key],
  }))

  return (
    <FormProvider {...formMethods}>
      {compareMode === CompareMode.Active && <CompareMenu />}
      {!showSidebar && (
        <MobileOverlay open={mobileOverlayOpen}>
          <MobileOverlay.Header onClose={() => setMobileOverlayOpen(false)}>
            <Heading level="1" size="medium">
              Filtrer søket
            </Heading>
          </MobileOverlay.Header>
          <MobileOverlay.Content>
            <SearchForm filters={data?.at(-1)?.filters} ref={searchFormRef} />
          </MobileOverlay.Content>
          <MobileOverlay.Footer>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: 16 }}>
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
              <Button
                type="button"
                variant="tertiary"
                size="small"
                icon={<Delete title="Nullstill søket" />}
                onClick={onReset}
              >
                Nullstill søket
              </Button>
            </div>
            <Button onClick={() => setMobileOverlayOpen(false)}>Vis {totalNumberOfProducts} søkeresultater</Button>
          </MobileOverlay.Footer>
        </MobileOverlay>
      )}
      <AnimateLayout>
        <div className="main-header">
          <Heading level="1" size="large" ref={pageTopRef}>
            Søk i hjelpemidler
          </Heading>
        </div>
        <div className="main-wrapper">
          <div className="flex-column-wrap">
            {showSidebar && (
              <Sidebar
                filters={data?.at(-1)?.filters}
                onResetSearchData={() => {
                  onReset()
                  searchFormRef.current && searchFormRef.current.reset()
                }}
                setFocus={setFocusOnSearchResults}
              />
            )}
            <section className="results__wrapper">
              {!showSidebar && (
                <div className="spacing-bottom--medium">
                  <Button variant="secondary" onClick={() => setMobileOverlayOpen(true)}>
                    Endre søk
                  </Button>
                </div>
              )}
              {filterValues.length > 0 && (
                <>
                  <Heading level="2" size="small">
                    Valgte filtre
                  </Heading>
                  <Chips className="results__chips">
                    {filterChips.map(({ key, label, values }, index) => {
                      return values
                        .filter((v) => v)
                        .map((value) => (
                          <Chips.Removable
                            key={index}
                            onClick={() => {
                              setFilter(
                                key,
                                values.filter((val) => val !== value)
                              )
                              setValue(
                                `filters.${key}`,
                                values.filter((val) => val !== value)
                              )
                            }}
                          >
                            {label === FilterCategories.produktkategori ? value : `${label}: ${value}`}
                          </Chips.Removable>
                        ))
                    })}
                  </Chips>
                </>
              )}
              <SearchResults
                data={data}
                size={size}
                setSize={setSize}
                isLoading={isLoading}
                productViewToggleRef={productViewToggleRef}
              />
            </section>
          </div>
        </div>
        {!isAtPageTop && (
          <Button
            type="button"
            className="search__page-up-button"
            icon={<Up title="Gå til toppen av siden" />}
            onClick={() => setFocusOnSearchResults()}
          />
        )}
      </AnimateLayout>
    </FormProvider>
  )
}
