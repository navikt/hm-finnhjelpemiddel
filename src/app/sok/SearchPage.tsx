'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import useSWRInfinite from 'swr/infinite'

import { ArrowUpIcon, FilesIcon, FilterIcon, TrashIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Button, HGrid, HStack, Heading, Loader, Popover, Show, VStack } from '@navikt/ds-react'

import { FetchProductsWithFilters, FilterData, PAGE_SIZE, fetchProducts, initialFilters } from '@/utils/api-util'
import { FormSearchData, initialSearchDataState } from '@/utils/search-state-util'

import AnimateLayout from '@/components/layout/AnimateLayout'

import { mapSearchParams, toSearchQueryString } from '@/utils/mapSearchParams'

import MobileOverlay from '@/components/MobileOverlay'
import SortSearchResults from '@/components/SortSearchResults'
import CompareMenu from '@/components/layout/CompareMenu'
import { initialFiltersFormState, visFilters } from '@/utils/filter-util'
import { useMobileOverlayStore } from '@/utils/global-state-util'
import SearchForm from './SearchForm'
import SearchResults from './SearchResults'

export default function SearchPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const copyButtonMobileRef = useRef<HTMLButtonElement>(null)
  const copyButtonDesktopRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<HTMLFormElement>(null)

  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const { isMobileOverlayOpen, setMobileOverlayOpen } = useMobileOverlayStore()

  const formMethods = useForm<FormSearchData>({
    mode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      ...initialSearchDataState,
      ...searchData,
    },
  })

  useEffect(() => {
    setShowSidebar(window.innerWidth >= 1024)
    window.addEventListener('resize', () => setShowSidebar(window.innerWidth >= 1024))
  }, [])

  const onSubmit: SubmitHandler<FormSearchData> = () => {
    router.replace(`${pathname}?${toSearchQueryString(formMethods.getValues(), searchData.searchTerm)}`, {
      scroll: false,
    })
  }

  const {
    data,
    size: page,
    setSize: setPage,
    error,
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

  const onReset = () => {
    formMethods.reset({ filters: initialFiltersFormState })
    setPage(1)
    router.replace(pathname)
  }
  const products = data?.map((d) => d.products).flat()

  if (error) {
    return (
      <HStack justify="center" style={{ marginTop: '48px' }}>
        <Alert variant="error" title="Error med lasting av produkter">
          Obs, her skjedde det noe feil :o
        </Alert>
      </HStack>
    )
  }

  if (!data) {
    return (
      <HStack justify="center" style={{ marginTop: '48px' }}>
        <Loader size="3xlarge" title="Laster produkter" />
      </HStack>
    )
  }

  const filtersFromData = data.at(-1)?.filters

  const filters: FilterData = {
    ...(filtersFromData ?? initialFilters),
    vis: visFilters,
  }

  if (error) {
    return (
      <HStack justify="center" style={{ marginTop: '48px' }}>
        <Alert variant="error" title="Error med lasting av produkter">
          Obs, her skjedde det noe feil :o
        </Alert>
      </HStack>
    )
  }

  if (!products) {
    return (
      <HStack justify="center" style={{ marginTop: '48px' }}>
        <Loader size="3xlarge" title="Laster produkter" />
      </HStack>
    )
  }

  return (
    <VStack className="main-wrapper--xlarge spacing-bottom--large">
      <VStack gap="5" className="spacing-top--xlarge spacing-bottom--xlarge">
        <Heading level="1" size="large" ref={pageTopRef}>
          Alle hjelpemidler
        </Heading>
      </VStack>
      <FormProvider {...formMethods}>
        <CompareMenu />
        <HGrid columns={{ xs: 1, lg: '374px auto' }} gap={{ xs: '4', lg: '18' }}>
          {showSidebar && (
            <section className="filter-container">
              <SearchForm onSubmit={onSubmit} filters={filters} ref={searchFormRef} />
              <HGrid columns={{ xs: 2 }} className="filter-container__footer" gap="2">
                <Button
                  ref={copyButtonDesktopRef}
                  variant="secondary"
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
                  anchorEl={copyButtonDesktopRef.current}
                  placement="right"
                >
                  <Popover.Content>Søket er kopiert!</Popover.Content>
                </Popover>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  icon={<TrashIcon title="Nullstill søket" />}
                  onClick={onReset}
                >
                  Nullstill søket
                </Button>
              </HGrid>
            </section>
          )}

          <VStack gap={{ xs: '4', lg: '8' }}>
            <HStack justify="space-between" className="results__header">
              <Show above="lg">
                <VStack justify="space-between">
                  <Heading level="2" size="small" ref={searchResultRef}>
                    Hjelpemiddel
                  </Heading>
                  <BodyShort aria-live="polite" style={{ marginLeft: '2px' }}>
                    {products ? `Viser de ${products.length} første` : `Ingen treff`}
                  </BodyShort>
                </VStack>
              </Show>
              {!showSidebar && (
                <div>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setMobileOverlayOpen(true)}
                    icon={<FilterIcon aria-hidden />}
                  >
                    Filter
                  </Button>
                  <MobileOverlay open={isMobileOverlayOpen}>
                    <MobileOverlay.Header onClose={() => setMobileOverlayOpen(false)}>
                      <Heading level="1" size="medium">
                        Filtrer søket
                      </Heading>
                    </MobileOverlay.Header>
                    <MobileOverlay.Content>
                      <SearchForm onSubmit={onSubmit} filters={filters} ref={searchFormRef} />
                    </MobileOverlay.Content>
                    <MobileOverlay.Footer>
                      <VStack gap="2">
                        <HGrid columns={{ xs: 2 }} className="filter-container__footer" gap="2">
                          <Button
                            ref={copyButtonMobileRef}
                            variant="secondary"
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
                            anchorEl={copyButtonMobileRef.current}
                            placement="right"
                          >
                            <Popover.Content>Søket er kopiert!</Popover.Content>
                          </Popover>

                          <Button
                            type="button"
                            variant="secondary"
                            size="small"
                            icon={<TrashIcon title="Nullstill søket" />}
                            onClick={onReset}
                          >
                            Nullstill søket
                          </Button>
                        </HGrid>
                        <Button onClick={() => setMobileOverlayOpen(false)}>Vis søkeresultater</Button>
                      </VStack>
                    </MobileOverlay.Footer>
                  </MobileOverlay>
                </div>
              )}

              <SortSearchResults formRef={searchFormRef} />
            </HStack>
            <AnimateLayout>
              <SearchResults products={products} loadMore={loadMore} isLoading={isLoading} formRef={searchFormRef} />
            </AnimateLayout>
            {!isAtPageTop && (
              <Button
                type="button"
                className="search__page-up-button"
                icon={<ArrowUpIcon title="Gå til toppen av siden" />}
                onClick={() => setFocusOnSearchResults()}
              />
            )}
          </VStack>
        </HGrid>
      </FormProvider>
    </VStack>
  )
}
