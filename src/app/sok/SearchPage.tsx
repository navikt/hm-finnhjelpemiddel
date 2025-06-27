'use client'

import { useEffect, useMemo, useRef } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import useSWRInfinite from 'swr/infinite'

import { FilterIcon } from '@navikt/aksel-icons'
import { Alert, Bleed, Button, Heading, HGrid, HStack, Show, Skeleton, VStack } from '@navikt/ds-react'

import { fetchProducts, FetchProductsWithFilters, FilterData, initialFilters, PAGE_SIZE } from '@/utils/api-util'
import { FormSearchData, initialSearchDataState } from '@/utils/search-state-util'

import { mapSearchParams, toSearchQueryString } from '@/utils/mapSearchParams'
import CompareMenu from '@/components/layout/CompareMenu'
import { categoryFilters, initialFiltersFormState, visFilters } from '@/utils/filter-util'
import { useMobileOverlayStore } from '@/utils/global-state-util'
import SearchForm from './SearchForm'
import SearchResults from './SearchResults'
import { logFilterEndretEvent } from '@/utils/amplitude'
import { MobileOverlayModal } from '@/components/MobileOverlayModal'
import { SearchSidebar } from '@/app/sok/SearchSidebar'
import { faro } from '@grafana/faro-core'
import SortSearchResults from '@/app/sok/SortSearchResults'

export default function SearchPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchFormRef = useRef<HTMLFormElement>(null)

  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const { setMobileOverlayOpen } = useMobileOverlayStore()

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

  const products = data?.map((d) => d.products).flat()
  const filtersFromData = data?.at(-1)?.filters

  const filters: FilterData = {
    ...(filtersFromData ?? initialFilters),
    vis: visFilters,
    category: categoryFilters,
    status: { values: [] },
  }

  const SearchPageBody = () => {
    return (
      <FormProvider {...formMethods}>
        <CompareMenu />
        <HGrid columns={{ xs: 1, lg: '374px auto' }} gap={{ xs: '4', lg: '18' }}>
          <Show above={'lg'}>
            <SearchSidebar onSubmit={onSubmit} filters={filters} searchFormRef={searchFormRef} onReset={onReset} />
          </Show>

          <Show below={'lg'}>
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
          </Show>

          <VStack gap={{ xs: '4', lg: '8' }}>
            <HStack
              justify={{ xs: 'start', lg: 'space-between' }}
              gap={{ xs: '4', lg: '0' }}
              className="results__header"
            >
              <Show above="lg">
                <VStack justify="space-between">
                  <Heading level="2" size="medium">
                    {isLoading ? (
                      <Skeleton variant="text" width="10rem" />
                    ) : products ? (
                      `Viser de ${products.length} første`
                    ) : (
                      `Ingen treff`
                    )}
                  </Heading>
                </VStack>
              </Show>

              <SortSearchResults formRef={searchFormRef} />
            </HStack>

            <SearchResults products={products} loadMore={loadMore} isLoading={isLoading} formRef={searchFormRef} />
          </VStack>
        </HGrid>
      </FormProvider>
    )
  }

  return (
    <VStack
      marginInline={'auto'}
      marginBlock={'0'}
      maxWidth={'1408px'}
      paddingBlock={'0 12'}
      paddingInline={'4'}
      gap={{ xs: '12', md: '12' }}
    >
      <Bleed style={{ backgroundColor: '#F5F9FF' }} reflectivePadding marginInline={'full'}>
        <VStack gap="4" align={'start'} paddingBlock={'12'}>
          <Heading level="1" size="large">
            {searchData.searchTerm ? `Søkeresultater: '${searchData.searchTerm}'` : 'Alle hjelpemidler'}
          </Heading>
        </VStack>
      </Bleed>

      {error ? (
        <HStack justify="center" style={{ marginTop: '48px' }}>
          <Alert variant="error" title="Error med lasting av produkter">
            Obs, her skjedde det noe feil :o
          </Alert>
        </HStack>
      ) : (
        <SearchPageBody />
      )}
    </VStack>
  )
}
