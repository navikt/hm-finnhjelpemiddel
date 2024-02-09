'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import useSWRInfinite from 'swr/infinite'

import { ArrowUpIcon, FilesIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button, Chips, Heading, Popover } from '@navikt/ds-react'

import { FetchProductsWithFilters, PAGE_SIZE, SearchData, SelectedFilters, fetchProducts } from '@/utils/api-util'
import { FilterCategories } from '@/utils/filter-util'
import { initialSearchDataState } from '@/utils/search-state-util'
import { Entries } from '@/utils/type-util'

import MobileOverlay from '@/components/MobileOverlay'
import AnimateLayout from '@/components/layout/AnimateLayout'

import SearchForm from './sidebar/SearchForm'

import { mapProductSearchParams, toSearchQueryString } from '@/utils/product-util'
import CompareMenu from './CompareMenu'
import SearchResults from './SearchResults'

export default function SearchPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<HTMLFormElement>(null)

  const [showSidebar, setShowSidebar] = useState(false)
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)

  const searchData = useMemo(() => mapProductSearchParams(searchParams), [searchParams])

  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...searchData,
    },
  })

  const onSubmit: SubmitHandler<SearchData> = (data) => {
    router.replace(`${pathname}?${toSearchQueryString(data)}`, { scroll: false })
  }

  const {
    data,
    size: page,
    setSize: setPage,
    isLoading,
  } = useSWRInfinite<FetchProductsWithFilters>(
    (index, previousPageData?: FetchProductsWithFilters) => {
      if (previousPageData && previousPageData.products.length === 0) return null
      return {
        from: index * PAGE_SIZE,
        size: PAGE_SIZE,
        searchData,
      }
    },
    fetchProducts,
    {
      initialSize: Number(searchParams.get('page') || '1'),
      keepPreviousData: true,
      revalidateFirstPage: false,
    }
  )

  const loadMore = useMemo(() => {
    const isEmpty = data?.[0]?.products.length === 0
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.products.length < PAGE_SIZE)
    if (isReachingEnd) {
      return // no need to fetch another page
    }

    return () => {
      const nextPage = page + 1
      const newParams = new URLSearchParams(searchParams)
      newParams.set('page', `${nextPage}`)
      const searchQueryString = newParams.toString()
      router.replace(`${pathname}?${searchQueryString}`, { scroll: false })
      setPage(nextPage)
    }
  }, [data, page, setPage, pathname, router, searchParams])

  const { ref: pageTopRef, inView: isAtPageTop } = useInView({ threshold: 0.4 })
  const searchResultRef = useRef<HTMLHeadingElement>(null)

  const setFocusOnSearchResults = () => {
    searchResultRef.current && searchResultRef.current.scrollIntoView()
  }

  useEffect(() => {
    setShowSidebar(window.innerWidth >= 1100)
    window.addEventListener('resize', () => setShowSidebar(window.innerWidth >= 1100))
  }, [])

  const onReset = () => {
    formMethods.reset()
    setPage(1)
    router.replace(pathname)
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
            <SearchForm onSubmit={onSubmit} filters={data?.at(-1)?.filters} ref={searchFormRef} />
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
                icon={<TrashIcon title="Nullstill søket" />}
                onClick={onReset}
              >
                Nullstill søket
              </Button>
            </div>
            <Button onClick={() => setMobileOverlayOpen(false)}>Vis søkeresultater</Button>
          </MobileOverlay.Footer>
        </MobileOverlay>
      )}
      <AnimateLayout>
        <div className="main-header">
          <Heading level="1" size="large" ref={pageTopRef}>
            Søk i hjelpemidler
          </Heading>
        </div>
        <div className="main-wrapper--large">
          <div className="flex-column-wrap spacing-top--large spacing-bottom--large">
            {showSidebar && (
              <section className="search__side-bar">
                <SearchForm onSubmit={onSubmit} filters={data?.at(-1)?.filters} ref={searchFormRef} />
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
                    icon={<TrashIcon title="Nullstill søket" />}
                    onClick={onReset}
                  >
                    Nullstill søket
                  </Button>
                </div>
              </section>
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
                    {filterChips.map(({ key, label, values }) => {
                      return values
                        .filter((v) => v)
                        .map((value) => {
                          return (
                            <Chips.Removable
                              key={key + value}
                              onClick={() => {
                                formMethods.setValue(
                                  `filters.${key}`,
                                  values.filter((val) => val !== value)
                                )
                                searchFormRef.current?.requestSubmit()
                              }}
                            >
                              {label === FilterCategories.produktkategori ? value : `${label}: ${value}`}
                            </Chips.Removable>
                          )
                        })
                    })}
                  </Chips>
                </>
              )}
              <SearchResults
                data={data}
                loadMore={loadMore}
                isLoading={isLoading}
                searchResultRef={searchResultRef}
                formRef={searchFormRef}
              />
            </section>
          </div>
        </div>
        {!isAtPageTop && (
          <Button
            type="button"
            className="search__page-up-button"
            icon={<ArrowUpIcon title="Gå til toppen av siden" />}
            onClick={() => setFocusOnSearchResults()}
          />
        )}
      </AnimateLayout>
    </FormProvider>
  )
}
