'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import useSWRInfinite from 'swr/infinite'

import { ArrowUpIcon, FilterIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Button, Heading, HGrid, HStack, Loader, Show, VStack } from '@navikt/ds-react'

import { fetchProducts, FetchProductsWithFilters, FilterData, initialFilters, PAGE_SIZE } from '@/utils/api-util'
import { FormSearchData, initialSearchDataState } from '@/utils/search-state-util'

import { mapSearchParams, toSearchQueryString } from '@/utils/mapSearchParams'
import SortSearchResults from '@/components/SortSearchResults'
import CompareMenu from '@/components/layout/CompareMenu'
import { categoryFilters, initialFiltersFormState, visFilters } from '@/utils/filter-util'
import { useMobileOverlayStore } from '@/utils/global-state-util'
import SearchForm from './SearchForm'
import SearchResults from './SearchResults'
import { logFilterEndretEvent, logVisit } from '@/utils/amplitude'
import { MobileOverlayModal } from '@/components/MobileOverlayModal'
import { SearchSidebar } from '@/app/sok/SearchSidebar'
import { faro } from '@grafana/faro-core'

export default function SearchPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchFormRef = useRef<HTMLFormElement>(null)

  const [showSidebar, setShowSidebar] = useState(false)

  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const { setMobileOverlayOpen } = useMobileOverlayStore()
  const { ref: pageTopRef, inView: isAtPageTop } = useInView({ threshold: 0.4 })
  const searchResultRef = useRef<HTMLHeadingElement>(null)

  const setFocusOnSearchResults = () => {
    searchResultRef.current && searchResultRef.current.scrollIntoView()
  }

  const formMethods = useForm<FormSearchData>({
    mode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      ...initialSearchDataState,
      ...searchData,
    },
  })

  useEffect(() => {
    typeof window !== 'undefined' &&
      faro.api.pushEvent('searchPage', {
        searchTerm: searchData.searchTerm,
      })
  }, [searchData.searchTerm])

  useEffect(() => {
    setShowSidebar(window.innerWidth >= 1024)
    window.addEventListener('resize', () => setShowSidebar(window.innerWidth >= 1024))
  }, [])

  const onSubmit: SubmitHandler<FormSearchData> = () => {
    logFilterEndretEvent('Søk')

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

  const onReset = () => {
    formMethods.reset({ filters: initialFiltersFormState })
    setPage(1)
    router.replace(pathname)
  }

  if (error || !data) {
    return (
      <div className="main-wrapper--xlarge spacing-bottom--large">
        <Heading level="1" size="large" className="spacing-top--xlarge spacing-bottom--xlarge" ref={searchResultRef}>
          Alle hjelpemidler
        </Heading>
        <HStack justify="center" style={{ marginTop: '48px' }}>
          {error ? (
            <Alert variant="error" title="Error med lasting av produkter">
              Obs, her skjedde det noe feil :o
            </Alert>
          ) : (
            !data && <Loader size="3xlarge" title="Laster produkter" />
          )}
        </HStack>
      </div>
    )
  }

  const products = data.map((d) => d.products).flat()
  const filtersFromData = data.at(-1)?.filters

  const filters: FilterData = {
    ...(filtersFromData ?? initialFilters),
    vis: visFilters,
    category: categoryFilters,
    status: { values: [] },
  }

  return (
    <div className="main-wrapper--xlarge spacing-bottom--large">
      <Heading level="1" size="large" className="spacing-top--xlarge spacing-bottom--xlarge" ref={searchResultRef}>
        Alle hjelpemidler
      </Heading>
      <span ref={pageTopRef} />

      <FormProvider {...formMethods}>
        <CompareMenu />
        <HGrid columns={{ xs: 1, lg: '374px auto' }} gap={{ xs: '4', lg: '18' }}>
          {showSidebar ? (
            <SearchSidebar onSubmit={onSubmit} filters={filters} searchFormRef={searchFormRef} onReset={onReset} />
          ) : (
            <div>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setMobileOverlayOpen(true)}
                icon={<FilterIcon aria-hidden />}
              >
                Filter
              </Button>

              <MobileOverlayModal
                body={<SearchForm onSubmit={onSubmit} filters={filters} ref={searchFormRef} />}
                onReset={onReset}
              />
            </div>
          )}

          <VStack gap={{ xs: '4', lg: '8' }}>
            <HStack
              justify={{ xs: 'start', lg: 'space-between' }}
              gap={{ xs: '4', lg: '0' }}
              className="results__header"
            >
              <Show above="lg">
                <VStack justify="space-between">
                  <Heading level="2" size="small">
                    Hjelpemiddel
                  </Heading>
                  <BodyShort aria-live="polite" style={{ marginLeft: '2px' }}>
                    {products ? `Viser de ${products.length} første` : `Ingen treff`}
                  </BodyShort>
                </VStack>
              </Show>

              <SortSearchResults formRef={searchFormRef} />
            </HStack>
            <SearchResults products={products} loadMore={loadMore} isLoading={isLoading} formRef={searchFormRef} />
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
    </div>
  )
}
