'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import useSWRInfinite from 'swr/infinite'

import { FilesIcon } from '@navikt/aksel-icons'
import { Delete, Up } from '@navikt/ds-icons'
import { Button, Chips, Heading, Popover } from '@navikt/ds-react'

import { agreementKeyLabels } from '@/utils/agreement-util'
import { FetchResponse, PAGE_SIZE, SearchData, SearchParams, SelectedFilters, fetchProducts } from '@/utils/api-util'
import { FilterCategories } from '@/utils/filter-util'
import { mapProductSearchParams, toSearchQueryString } from '@/utils/product-util'
import { initialSearchDataState, useHydratedSearchStore } from '@/utils/search-state-util'
import { Entries } from '@/utils/type-util'

import MobileOverlay from '@/components/MobileOverlay'
import AnimateLayout from '@/components/layout/AnimateLayout'

import SearchForm, { SearchFormResetHandle } from './sidebar/SearchForm'
import Sidebar from './sidebar/Sidebar'

import CompareMenu from './CompareMenu'
import SearchResults from './SearchResults'

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<SearchFormResetHandle>(null)

  const [searchInitialized, setSearchInitialized] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [productSearchParams, setProductSearchParams] = useState<SearchParams>(mapProductSearchParams(searchParams))

  const { searchData, setFilter, setSearchData } = useHydratedSearchStore()

  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...productSearchParams,
    },
  })

  const {
    data,
    size: page,
    setSize: setPage,
    isLoading,
  } = useSWRInfinite<FetchResponse>(
    (index) => {
      const from = index !== 0 ? (productSearchParams.to || PAGE_SIZE) + (index - 1) * PAGE_SIZE : 0
      const to = (index === 0 && productSearchParams.to) || PAGE_SIZE
      return {
        from,
        to,
        searchData,
      }
    },
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

  const { ref: pageTopRef, inView: isAtPageTop } = useInView({ threshold: 0.4 })
  const searchResultRef = useRef<HTMLHeadingElement>(null)

  const setFocusOnSearchResults = () => {
    searchResultRef.current && searchResultRef.current.scrollIntoView()
  }

  const products = data?.flatMap((d) => d.products)
  const numberOfFetchedProducts = products && products.length > PAGE_SIZE ? products.length : undefined
  const totalNumberOfProducts = data?.at(-1)?.numberOfProducts

  //Det er en bug i Next som gjør at scroll position ikke beholdes
  //selv når page state beholdes. Dette er kun et problem i Produktserier på stor skjerm.
  //Se: https://github.com/vercel/next.js/issues/49087.
  //Må følge med på issue og gjøre eventuelle endringer dersom det løses av Next.

  useEffect(() => {
    if (searchInitialized) {
      router.push(
        pathname +
          toSearchQueryString({
            ...searchData,
            to: numberOfFetchedProducts,
          })
      )
    }
  }, [router, searchInitialized, searchData, numberOfFetchedProducts, pathname])

  useEffect(() => {
    setShowSidebar(window.innerWidth >= 1100)
    window.addEventListener('resize', () => setShowSidebar(window.innerWidth >= 1100))
  }, [])

  useEffect(() => {
    if (data) {
      setSearchInitialized(true)
    }
  }, [data])

  useEffect(() => {
    setProductSearchParams(mapProductSearchParams(searchParams))
  }, [searchParams, setProductSearchParams])

  useEffect(() => setSearchData(productSearchParams), [productSearchParams, setSearchData])

  const onReset = () => {
    setProductSearchParams({ ...initialSearchDataState, to: undefined })
    setPage(1)
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
      <CompareMenu />
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
                        .map((value) => {
                          let valueLabel = value
                          if (key === 'rammeavtale') {
                            valueLabel = agreementKeyLabels[value]
                          }
                          return (
                            <Chips.Removable
                              key={index}
                              onClick={() => {
                                setFilter(
                                  key,
                                  values.filter((val) => val !== value)
                                )
                                formMethods.setValue(
                                  `filters.${key}`,
                                  values.filter((val) => val !== value)
                                )
                              }}
                            >
                              {label === FilterCategories.produktkategori ? value : `${label}: ${valueLabel}`}
                            </Chips.Removable>
                          )
                        })
                    })}
                  </Chips>
                </>
              )}
              <SearchResults
                data={data}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                searchResultRef={searchResultRef}
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
