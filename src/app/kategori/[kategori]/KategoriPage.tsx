'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { Heading, HGrid, HStack, VStack } from '@navikt/ds-react'
import CompareMenu from '@/components/layout/CompareMenu'
import { KategoriResults } from '../KategoriResults'
import { FilterBarKategori, Filters } from '@/app/kategori/filter/FilterBarKategori'
import useQueryString from '@/utils/search-params-util'
import { fetchProductsKategori, PAGE_SIZE, ProductsWithIsoAggs } from '@/app/kategori/utils/kategori-inngang-util'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'

type Props = {
  category: CategoryDTO
}

export const KategoriPage = ({ category }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringAppendRemovePage, createQueryStringForMinMax } = useQueryString()

  /*
  useEffect(() => {
    mapSearchParamsKategori(searchParams)
  }, [searchParams])
   */

  const {
    data: productsData,
    size: page,
    setSize: setPage,
    error,
    isLoading,
  } = useSWRInfinite<ProductsWithIsoAggs>(
    (index, previousPageData?: ProductsWithIsoAggs) => {
      // Stop paginating when previous page has no products
      if (previousPageData && previousPageData.products.length === 0) return null

      return {
        from: index * PAGE_SIZE,
        size: PAGE_SIZE,
        searchParams,
        kategoriIsos: category.data.isos,
      }
    },
    fetchProductsKategori,
    {
      initialSize: Number(searchParams.get('page') || '1'),
      keepPreviousData: true,
      revalidateFirstPage: false,
    }
  )

  const products = productsData?.map((d) => d.products).flat()
  const isos = productsData?.at(-1)?.iso.map((iso) => ({ key: iso.code, label: iso.name })) ?? []
  const suppliers = productsData?.at(-1)?.suppliers.map((supplier) => supplier.name) ?? []
  const measurementFilters = productsData?.at(-1)?.measurementFilters ?? undefined
  const techDataFilterAggs = productsData?.at(-1)?.techDataFilterAggs

  const isEmpty = productsData?.[0]?.products.length === 0
  const isReachingEnd = isEmpty || (productsData && productsData[productsData.length - 1]?.products.length < PAGE_SIZE)

  const loadMore = !isReachingEnd
    ? () => {
        const nextPage = page + 1
        const newParams = new URLSearchParams(searchParams)
        newParams.set('page', `${nextPage}`)
        const searchQueryString = newParams.toString()
        router.replace(`${pathname}?${searchQueryString}`, { scroll: false })
        setPage(nextPage)
      }
    : undefined

  const filters: Filters = { isos, suppliers, measurementFilters, techDataFilterAggs }

  const onChange = (filterName: string, value: string | string[]) => {
    const singleValue = Array.isArray(value) ? value[0] : value
    const paramKeyMap: Record<string, string> = {
      suppliers: 'leverandor',
      isos: 'iso',
    }
    const paramKey = paramKeyMap[filterName] || filterName
    let newSearchParams: string
    if (filterName === 'suppliers' || filterName === 'isos') {
      newSearchParams = createQueryStringAppendRemovePage(paramKey, singleValue)
    } else {
      newSearchParams = createQueryStringForMinMax(paramKey, singleValue)
      const params = new URLSearchParams(newSearchParams)
      params.delete('page')
      newSearchParams = params.toString()
    }
    setPage(1)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onReset = () => {
    setPage(1)
    router.replace(pathname)
  }

  return (
    <KategoriPageLayout title={category.title} description={category.data.description} error={error}>
      <>
        <CompareMenu />
        <HGrid columns={'374px 4'} gap={'space-16'}>
          <VStack gap={'space-16'}>
            <Heading level="2" size="medium">
              {isLoading
                ? /* <Skeleton variant="text" width="10rem" />*/
                  'Viser første '
                : products
                  ? `Viser første ${products.length}`
                  : `Ingen treff`}
            </Heading>
            <HStack justify={'space-between'} gap={'space-8'} align={'end'}>
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
