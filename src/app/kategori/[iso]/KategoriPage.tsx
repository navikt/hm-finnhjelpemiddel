'use client'

import { useMemo } from 'react'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { Alert, Bleed, BodyLong, Heading, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'
import CompareMenu from '@/components/layout/CompareMenu'
import { KategoriResults } from './KategoriResults'
import { SortKategoriResults } from '@/app/kategori/[iso]/SortKategoriResults'
import { FilterBarKategori, Filters } from '@/app/kategori/[iso]/FilterBarKategori'
import useQueryString from '@/utils/search-params-util'
import { Product } from '@/utils/product-util'
import {
  fetchProductsKategori,
  PAGE_SIZE,
  ProductsWithIsoAggs,
  SearchDataKategori,
  SearchFiltersKategori,
} from '@/utils/kategori-inngang-util'
import { isValidSortOrder } from '@/utils/search-state-util'
import { IsoTree } from '@/utils/iso-util'
import { CategoryCard } from '@/app/kategori/bevegelse/CategoryCard'

type Props = {
  iso: string
  isoTree: IsoTree
}

export const KategoriPage = ({ iso, isoTree }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringAppend } = useQueryString()

  const mapSearchParamsKategori = (searchParams: ReadonlyURLSearchParams): SearchDataKategori => {
    const sortOrderStr = searchParams.get('sortering') || ''
    const sortOrder = isValidSortOrder(sortOrderStr) ? sortOrderStr : 'Rangering'

    const isoCode = searchParams.get('isoCode') ?? ''

    const suppliers = searchParams.getAll('supplier') ?? ''
    const isos = searchParams.getAll('iso') ?? ''

    const filters: SearchFiltersKategori = { suppliers: suppliers, isos: isos }

    return {
      sortOrder,
      isoCode,
      filters,
    }
  }
  const searchData = mapSearchParamsKategori(searchParams)

  searchData.isoCode = iso

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
  }, [productsData, page, setPage, pathname, router, searchParams])

  const products = productsData?.map((d) => d.products).flat()
  const isos = productsData?.at(-1)?.iso.map((iso) => ({ key: iso.code, label: iso.name })) ?? []
  const suppliers = productsData?.at(-1)?.suppliers.map((supplier) => supplier.name) ?? []

  const filters: Filters = { isos: isos, suppliers: suppliers }

  const onChange = (filterName: string, value: string) => {
    const newSearchParams = createQueryStringAppend(filterName, value)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onReset = () => router.replace(pathname)

  const currentIso = isoTree[iso]!
  const deeperIsos = Object.values(isoTree).filter(
    (iso) => iso.isoCode.startsWith(currentIso.isoCode) && iso.isoLevel === currentIso.isoLevel + 1
  )
  const deeperIsosWithProducts = deeperIsos.filter((iso) =>
    isos.find((productIso) => productIso.key.startsWith(iso.isoCode))
  )

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
          {currentIso.isoTitle}
        </Heading>
        <BodyLong style={{ maxWidth: '735px' }}>{currentIso.isoText}</BodyLong>
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
            {currentIso.isoLevel < 4 && deeperIsosWithProducts.length > 1 && (
              <HGrid gap={'2'} columns={'repeat(5, 200px)'} paddingBlock={'8 0'}>
                {deeperIsosWithProducts.map((nextIsoLevel) => (
                  <CategoryCard
                    icon={undefined}
                    title={nextIsoLevel.isoTitle}
                    link={nextIsoLevel.isoCode}
                    description={''}
                    key={nextIsoLevel.isoCode}
                  />
                ))}
              </HGrid>
            )}
            <HGrid paddingBlock={{ xs: '6 0', md: '12 0' }} columns={'374px 4'} gap={'4'}>
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
                  <FilterBarKategori filters={filters} onChange={onChange} onReset={onReset} />
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
