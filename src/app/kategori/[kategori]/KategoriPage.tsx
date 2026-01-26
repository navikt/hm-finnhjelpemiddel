'use client'

import React, { useEffect } from 'react'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { Heading, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'
import CompareMenu from '@/components/layout/CompareMenu'
import { KategoriResults } from '../KategoriResults'
import { FilterBarKategori, Filters } from '@/app/kategori/filter/FilterBarKategori'
import {
  fetchProductsKategori,
  PAGE_SIZE,
  ProductsWithIsoAggs,
  SearchDataKategori,
  SearchFiltersKategori,
} from '@/app/kategori/utils/kategori-inngang-util'
import { isValidSortOrder } from '@/utils/search-state-util'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'

type Props = {
  category: CategoryDTO
}

export const KategoriPage = ({ category }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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
      suppliers,
      isos,
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
  useEffect(() => {
    // Ensure filters are synced with search params
    mapSearchParamsKategori(searchParams)
  }, [searchParams])

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
        searchData,
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

  const filters: Filters = { isos, suppliers, measurementFilters }


  const onChange = (filterName: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')


    if (filterName === 'suppliers') {
      let newValues: string[]

      if (value === '') {
        newValues = []
      } else {
        const singleValue = Array.isArray(value) ? value[0] : value
        const currentValues = searchParams.getAll('supplier') ?? []

        if (currentValues.includes(singleValue)) {
          newValues = currentValues.filter((v) => v !== singleValue)
        } else {
          newValues = [...currentValues, singleValue]
        }
      }

      params.delete('supplier')
      newValues.forEach((v) => params.append('supplier', v))
      setPage(1)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      return
    }

    if (filterName === 'isos') {
      let newValues: string[]

      if (value === '') {
        newValues = []
      } else {
        const singleValue = Array.isArray(value) ? value[0] : value
        const currentValues = searchParams.getAll('iso') ?? []

        if (currentValues.includes(singleValue)) {
          newValues = currentValues.filter((v) => v !== singleValue)
        } else {
          newValues = [...currentValues, singleValue]
        }
      }

      params.delete('iso')
      newValues.forEach((v) => params.append('iso', v))
      setPage(1)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      return
    }

    // measurement / single-value filters
    const valueStr = Array.isArray(value) ? value.join(',') : value

    params.set(String(filterName), valueStr)
    setPage(1)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const onReset = () => {
    setPage(1)
    router.replace(pathname)
  }

  return (
    <KategoriPageLayout title={category.title} description={category.data.description} error={error}>
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
