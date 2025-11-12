'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { Alert, Bleed, BodyLong, Heading, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'
import { fetchProductsKategori, PAGE_SIZE } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import CompareMenu from '@/components/layout/CompareMenu'
import { KategoriResults } from './KategoriResults'
import { SortKategoriResults } from '@/app/kategori/bevegelse/manuelle-rullestoler/SortKategoriResults'
import { FilterBarKategori, RullestolFilters } from '@/app/kategori/bevegelse/manuelle-rullestoler/FilterBarKategori'
import useQueryString from '@/utils/search-params-util'
import { Product } from '@/utils/product-util'

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringAppend } = useQueryString()

  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const isokode = '1222' // Manuelle rullestoler
  searchData.isoCode = isokode

  const {
    data: productsData,
    size: page,
    setSize: setPage,
    error,
    isLoading,
  } = useSWRInfinite<Product[]>(
    (index, previousPageData?: Product[]) => {
      if (previousPageData && previousPageData.length === 0) return null
      return {
        from: index * PAGE_SIZE,
        size: PAGE_SIZE,
        searchData,
      }
    },
    fetchProductsKategori,
    {
      initialSize: Number(searchParams.get('page') || '1'),
      keepPreviousData: true,
      revalidateFirstPage: false,
    }
  )

  const loadMore = useMemo(() => {
    const isEmpty = productsData?.[0]?.length === 0
    const isReachingEnd = isEmpty || (productsData && productsData[productsData.length - 1]?.length < PAGE_SIZE)
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
  }, [productsData, page, setPage, pathname, router, searchParams])

  const products = productsData?.map((d) => d).flat()

  const filters: RullestolFilters = {
    aktive: [{ label: 'Ja', value: 'ja' }],
    allround: [{ label: 'Ja', value: 'ja' }],
    drivaggregat: [{ label: 'Ja', value: 'ja' }],
    komfort: [{ label: 'Ja', value: 'ja' }],
    leverandor: [{ label: 'Ja', value: 'ja' }],
    staa: [{ label: 'Ja', value: 'ja' }],
  }

  const onChange = (filterName: string, value: string) => {
    const newSearchParams = createQueryStringAppend(filterName, value)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  return (
    <VStack
      gap={'14'}
      paddingBlock={'16'}
      paddingInline={'4'}
      marginInline={'auto'}
      marginBlock={'0'}
      maxWidth={'1440px'}
    >
      <VStack gap="4">
        <Heading level="1" size="large">
          Manuelle rullestoler
        </Heading>
        <BodyLong>
          Hjelpemidler som gir mobilitet og sittende støtte for personer med begrenset bevegelighet, der brukeren selv
          eller en ledsager kjører rullestolen manuelt.
        </BodyLong>
      </VStack>

      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        {error ? (
          <HStack justify="center" style={{ marginTop: '48px' }}>
            <Alert variant="error" title="Error med lasting av produkter">
              Obs, her skjedde det noe feil :o
            </Alert>
          </HStack>
        ) : (
          <>
            <CompareMenu />
            <HGrid columns={'374px 4'} gap={'4'}>
              <VStack gap={'4'}>
                <Heading level="2" size="medium">
                  {isLoading ? (
                    <Skeleton variant="text" width="10rem" />
                  ) : products ? (
                    `${products.length} hjelpemidler`
                  ) : (
                    `Ingen treff`
                  )}
                </Heading>
                <HStack justify={'space-between'} gap={'2'} align={'end'}>
                  <FilterBarKategori filters={filters} onChange={onChange} />
                  <SortKategoriResults />
                </HStack>

                <KategoriResults products={products} loadMore={loadMore} isLoading={isLoading} />
              </VStack>
            </HGrid>
          </>
        )}
      </Bleed>
    </VStack>
  )
}
