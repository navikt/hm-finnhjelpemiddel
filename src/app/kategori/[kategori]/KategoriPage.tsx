'use client'

import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { HGrid, HStack, VStack } from '@navikt/ds-react'
import CompareMenu from '@/components/layout/CompareMenu'
import { KategoriResults } from '../KategoriResults'
import { FilterBarKategori, Filters } from '@/app/kategori/filter/FilterBarKategori'
import useQueryString from '@/utils/search-params-util'
import { fetchProductsKategori, PAGE_SIZE, ProductsWithIsoAggs } from '@/app/kategori/utils/kategori-inngang-util'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'
import useSWR from 'swr'
import { Product } from '@/utils/product-util'

type Props = {
  category: CategoryDTO
}

export const KategoriPage = ({ category }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringAppendRemovePage, createQueryStringForMinMaxRemovePage } = useQueryString()

  const [pageIndex, setPageIndex] = useState<number>(Number(searchParams.get('page') || '1'))
  const [previousProducts, setPreviousProducts] = useState<Product[]>([])

  const firstLoadWithPageState = pageIndex > 1 && previousProducts.length === 0
  const pageSize = firstLoadWithPageState ? pageIndex * PAGE_SIZE : PAGE_SIZE

  const {
    data: productsData,
    error,
    isLoading,
  } = useSWR<ProductsWithIsoAggs>(
    {
      from: firstLoadWithPageState ? 0 : (pageIndex - 1) * PAGE_SIZE,
      size: pageSize,
      searchParams,
      category: category,
    },
    fetchProductsKategori,
    {
      revalidateOnFocus: false,
    }
  )

  const products = productsData?.products
  const isos = productsData?.iso.map((iso) => ({ key: iso.code, label: iso.name })) ?? []
  const suppliers = productsData?.suppliers.map((supplier) => supplier.name) ?? []
  const techDataFilterAggs = productsData?.techDataFilterAggs

  const moreProducts = products
    ? previousProducts
        .filter((previousProduct) => products.find((product) => previousProduct.id === product.id) === undefined)
        .concat(products)
    : previousProducts

  const isEmpty = products && products.length === 0
  const isReachingEnd = isEmpty || (products && products.length < pageSize)

  const loadMore = !isReachingEnd
    ? () => {
        const nextPage = pageIndex + 1
        const newParams = new URLSearchParams(searchParams)
        newParams.set('page', `${nextPage}`)
        const searchQueryString = newParams.toString()
        setPreviousProducts(moreProducts)
        setPageIndex(nextPage)
        router.replace(`${pathname}?${searchQueryString}`, { scroll: false })
      }
    : undefined

  const filters: Filters = { isos, suppliers, techDataFilterAggs }

  const resetPageStates = () => {
    setPreviousProducts([])
    setPageIndex(1)
  }

  const onChangeCheckBoxFilter = (filterName: string, value: string) => {
    const paramKeyMap: Record<string, string> = {
      suppliers: 'leverandor',
      isos: 'iso',
    }
    const paramKey = paramKeyMap[filterName] || filterName
    const newSearchParams = createQueryStringAppendRemovePage(paramKey, value)
    resetPageStates()
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onChangeRangeFilter = (filterName: string, value: string) => {
    const newSearchParams = createQueryStringForMinMaxRemovePage(filterName, value)
    resetPageStates()
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onReset = () => {
    resetPageStates()
    router.replace(pathname)
  }

  return (
    <KategoriPageLayout title={category.title} description={category.data.description} error={error}>
      <>
        <CompareMenu />
        <HGrid columns={'374px 4'} gap={'space-16'}>
          <VStack gap={'space-16'}>
            <HStack justify={'space-between'} gap={'space-8'} align={'end'}>
              <FilterBarKategori
                filters={filters}
                onChange={onChangeCheckBoxFilter}
                onReset={onReset}
                onChangeRange={onChangeRangeFilter}
              />
              {/*<SortKategoriResults />*/}
            </HStack>

            <KategoriResults
              products={moreProducts}
              loadMore={loadMore}
              isLoading={isLoading}
              isReachingEnd={isReachingEnd}
            />
          </VStack>
        </HGrid>
      </>
    </KategoriPageLayout>
  )
}
