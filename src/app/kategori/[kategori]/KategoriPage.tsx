'use client'

import { useMemo } from 'react'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { Heading, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'
import CompareMenu from '@/components/layout/CompareMenu'
import { KategoriResults } from '../KategoriResults'
import { FilterBarKategori, Filters } from '@/app/kategori/FilterBarKategori'
import useQueryString from '@/utils/search-params-util'
import { Product } from '@/utils/product-util'
import {
  fetchProductsKategori2,
  PAGE_SIZE,
  ProductsWithIsoAggs,
  SearchDataKategori,
  SearchFiltersKategori,
} from '@/app/kategori/utils/kategori-inngang-util'
import { isValidSortOrder } from '@/utils/search-state-util'
import { kategorier, KategoriNavn } from '@/app/kategori/utils/mappings/kategori-mapping'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'

type Props = {
  kategori: KategoriNavn
}

export const KategoriPage = ({ kategori }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringAppendRemovePage } = useQueryString()

  const mapSearchParamsKategori = (searchParams: ReadonlyURLSearchParams): SearchDataKategori => {
    const sortOrderStr = searchParams.get('sortering') || ''
    const sortOrder = isValidSortOrder(sortOrderStr) ? sortOrderStr : 'Rangering'

    const isoCode = searchParams.get('isoCode') ?? ''

    const suppliers = searchParams.getAll('supplier') ?? ''
    const isos = searchParams.getAll('iso') ?? ''

    const setebredde = searchParams.get('Setebredde') ?? ''
    const setedybde = searchParams.get('Setedybde') ?? ''
    const setehoyde = searchParams.get('Setehoyde') ?? ''

    const filters: SearchFiltersKategori = {
      suppliers: suppliers,
      isos: isos,
      Setehoyde: setehoyde,
      Setedybde: setedybde,
      Setebredde: setebredde,
    }

    return {
      sortOrder,
      isoCode,
      filters,
    }
  }
  const searchData = mapSearchParamsKategori(searchParams)

  const searchParamsKey = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    return params.toString()
  }, [searchParams])

  const currentKategori = kategorier[kategori]

  const {
    data: productsData,
    size: page,
    setSize: setPage,
    error,
    isLoading,
  } = useSWRInfinite<ProductsWithIsoAggs>(
    (index, previousPageData?: Product[]) => {
      if (previousPageData && previousPageData.length === 0) return null
      return {
        from: index * PAGE_SIZE,
        size: PAGE_SIZE,
        searchData,
        kategoriIsos: currentKategori.isoer,
      }
    },
    fetchProductsKategori2,
    {
      initialSize: Number(searchParams.get('page') || '1'),
      keepPreviousData: true,
      revalidateFirstPage: false,
    }
  )

  const loadMore = useMemo(() => {
    const isEmpty = productsData?.[0]?.products.length === 0
    const isReachingEnd =
      isEmpty || (productsData && productsData[productsData.length - 1]?.products.length < PAGE_SIZE)
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
  }, [productsData, page, setPage, pathname, router, searchParamsKey])

  const products = productsData?.map((d) => d.products).flat()
  const isos = productsData?.at(-1)?.iso.map((iso) => ({ key: iso.code, label: iso.name })) ?? []
  const suppliers = productsData?.at(-1)?.suppliers.map((supplier) => supplier.name) ?? []
  const measurementFilters = productsData?.at(-1)?.measurementFilters ?? undefined

  const filters: Filters = { isos: isos, suppliers: suppliers, measurementFilters: measurementFilters }

  const onChange = (filterName: string, value: string) => {
    const newSearchParams = createQueryStringAppendRemovePage(filterName, value)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onReset = () => router.replace(pathname)

  return (
    <KategoriPageLayout title={currentKategori.navn} description={currentKategori.beskrivelse} error={error}>
      <>
        <CompareMenu />
        <HGrid columns={'374px 4'} gap={'4'}>
          <VStack gap={'4'}>
            <Heading level="2" size="medium">
              {isLoading ? (
                <Skeleton variant="text" width="10rem" />
              ) : products ? (
                `Viser første ${products.length}`
              ) : (
                `Ingen treff`
              )}
            </Heading>
            <HStack justify={'space-between'} gap={'2'} align={'end'}>
              <FilterBarKategori filters={filters} onChange={onChange} onReset={onReset} />
              {/*<SortKategoriResults />*/}
            </HStack>

            <KategoriResults products={products} loadMore={loadMore} isLoading={isLoading} />
          </VStack>
        </HGrid>
      </>
    </KategoriPageLayout>
  )
}
