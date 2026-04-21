'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { Box, HGrid, HStack, ReadMore, VStack } from '@navikt/ds-react'
import CompareMenu from '@/components/layout/CompareMenu'
import { CategoryResults } from '../CategoryResults'
import { FilterBarCategory, Filters } from '@/app/kategori/filter/FilterBarCategory'
import useQueryString from '@/utils/search-params-util'
import { fetchProductsCategory, PAGE_SIZE } from '@/app/kategori/utils/kategori-inngang-util'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'
import { ProductsWithIsoAggs } from '@/app/kategori/utils/category-types'
import { logUmamiClickButton } from '@/utils/umami'

type Props = {
  category: CategoryDTO
}

export const CategoryPage = ({ category }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringAppend } = useQueryString()

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
        category: category,
      }
    },
    fetchProductsCategory,
    {
      initialSize: Number(searchParams.get('page') || '1'),
      keepPreviousData: true,
      revalidateFirstPage: false,
    }
  )

  const products = productsData?.map((d) => d.products).flat()
  const isos = productsData?.at(-1)?.iso.map((iso) => ({ key: iso.code, label: iso.name })) ?? []
  const suppliers = productsData?.at(-1)?.suppliers.map((supplier) => supplier.name) ?? []
  const digitalSoknad = productsData?.at(-1)?.digitalSoknad ?? []
  const bestillingsordning = productsData?.at(-1)?.bestillingsordning ?? []
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

  const filters: Filters = {
    suppliers: suppliers,
    digitalSoknad: digitalSoknad,
    bestillingsordning: bestillingsordning,
    isos: isos,
    techDataFilterAggs: techDataFilterAggs,
  }

  const onChangeCheckBoxFilter = (filterName: string, value: string) => {
    const paramKeyMap: Record<string, string> = {
      suppliers: 'leverandor',
      isos: 'iso',
    }
    const paramKey = paramKeyMap[filterName] || filterName
    const newSearchParams = createQueryStringAppend(paramKey, value)
    setPage(1)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onReset = () => {
    setPage(1)
    router.replace(pathname)
  }
  const lastSubcategoryText = 'Hva betyr «På avtale» og «Rangering»?'
  return (
    <CategoryPageLayout title={category.title} description={category.data.description} error={error}>
      <>
        <CompareMenu />
        <HGrid columns={'374px 4'} gap={'space-16'}>
          <Box maxWidth={'500px'}>
            <ReadMore
              variant={'moderate'}
              size={'large'}
              header={lastSubcategoryText}
              onOpenChange={(open) => {
                logUmamiClickButton(`${lastSubcategoryText}`, 'lastSubcategory-readmore', `${open}`)
              }}
            >
              Alle hjelpemidlene på FinnHjelpemiddel som er på avtale er markert med «På avtale». I tillegg er de
              markert med «Delkontrakt» og «Rangering». I mange tilfeller er det nyttig å samarbeide med en fagperson i
              kommunen for å komme frem til det til det mest hensiktsmessige hjelpemidlet, og å skrive selve søknaden.
              <ul>
                <li>
                  Delkontrakt: Avtalene inndeles i delkontrakter ut ifra hjelpemidlenes egenskaper. Å lese teksten i
                  delkontrakten kan gjøre det lettere for deg å finne det du er ute etter.
                </li>
                <li>
                  Rangering: En delkontrakt omfatter som regel flere hjelpemidler. Disse er inndelt i rangeringer. Du må
                  alltid starte med å vurdere om hjelpemidlet som er markert med «Rangering 1» dekker ditt behov. Dersom
                  det ikke gjøre det må det begrunnes i søknaden.
                </li>
              </ul>
            </ReadMore>
          </Box>
          <VStack gap={'space-16'}>
            <HStack justify={'space-between'} gap={'space-8'} align={'end'}>
              <FilterBarCategory filters={filters} onChange={onChangeCheckBoxFilter} onReset={onReset} />
            </HStack>

            <CategoryResults products={products} loadMore={loadMore} isLoading={isLoading} />
          </VStack>
        </HGrid>
      </>
    </CategoryPageLayout>
  )
}
