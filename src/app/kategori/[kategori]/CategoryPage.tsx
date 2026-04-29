'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { Box, HGrid, HStack, ReadMore, VStack } from '@navikt/ds-react'
import CompareMenu from '@/components/layout/CompareMenu'
import { CategoryResults } from '../CategoryResults'
import { FilterBarCategory, Filters } from '@/app/kategori/filter/FilterBarCategory'
import useQueryString from '@/utils/search-params-util'
import {
  fetchProductsCategory,
  MINIMUM_NON_AGREEMENT_SIZE,
  PAGE_SIZE,
} from '@/app/kategori/utils/kategori-inngang-util'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'
import { ProductsWithIsoAggs, SupplierInfo } from '@/app/kategori/utils/category-types'
import { logUmamiClickButton } from '@/utils/umami'
import useSWRImmutable from 'swr/immutable'

type Props = {
  category: CategoryDTO
}

export const CategoryPage = ({ category }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringAppend } = useQueryString()

  const {
    data: productsOnAgreement,
    error,
    isLoading,
  } = useSWRImmutable<ProductsWithIsoAggs>([pathname, searchParams], () =>
    fetchProductsCategory({
      from: 0,
      size: 1000,
      searchParams,
      category: category,
      onAgreement: true,
    })
  )

  const initialNotOnAgreementSize = Math.max(
    PAGE_SIZE - (productsOnAgreement?.products.length ?? 0),
    MINIMUM_NON_AGREEMENT_SIZE
  )

  const {
    data: productsNotOnAgreement,
    size: page,
    setSize: setPage,
    //error,
    //isLoading,
  } = useSWRInfinite<ProductsWithIsoAggs>(
    (index, previousPageData?: ProductsWithIsoAggs) => {
      // Stop paginating when previous page has no products
      if (previousPageData && previousPageData.products.length === 0) return null

      return {
        from: index > 0 ? index * PAGE_SIZE + initialNotOnAgreementSize : 0,
        size: index > 0 ? PAGE_SIZE : initialNotOnAgreementSize,
        searchParams,
        category: category,
        onAgreement: false,
      }
    },
    fetchProductsCategory,
    {
      initialSize: Number(searchParams.get('page') || '1'),
      keepPreviousData: true,
      revalidateFirstPage: false,
    }
  )

  const mergedProductsData = {
    products: productsOnAgreement?.products.concat(productsNotOnAgreement?.at(-1)?.products ?? []),
    isos: productsOnAgreement?.iso.concat(productsNotOnAgreement?.at(-1)?.iso ?? []),
    suppliers: productsOnAgreement?.suppliers.concat(productsNotOnAgreement?.at(-1)?.suppliers ?? []),
    digitalSoknad: productsOnAgreement?.digitalSoknad.concat(productsNotOnAgreement?.at(-1)?.digitalSoknad ?? []),
    bestillingsordning: productsOnAgreement?.bestillingsordning.concat(
      productsNotOnAgreement?.at(-1)?.bestillingsordning ?? []
    ),
    techDataFilterAggs: new Map([
      ...(productsOnAgreement?.techDataFilterAggs ?? new Map()),
      ...(productsNotOnAgreement?.at(-1)?.techDataFilterAggs ?? new Map()),
    ]),
  }

  const products = mergedProductsData?.products
  const isos = mergedProductsData?.isos?.map((iso) => ({ key: iso.code, label: iso.name })) ?? []
  const suppliers = mergedProductsData?.suppliers?.map((supplier) => supplier.name) ?? []
  const digitalSoknad = mergedProductsData?.digitalSoknad ?? []
  const bestillingsordning = mergedProductsData?.bestillingsordning ?? []
  const techDataFilterAggs = mergedProductsData?.techDataFilterAggs

  const isEmpty = productsNotOnAgreement?.[0]?.products.length === 0
  const isReachingEnd =
    isEmpty ||
    (productsNotOnAgreement &&
      productsNotOnAgreement[productsNotOnAgreement.length - 1]?.products.length % MINIMUM_NON_AGREEMENT_SIZE !== 0)

  const loadMore = !isReachingEnd
    ? () => {
        const nextPage = page + 1
        const newParams = new URLSearchParams(searchParams)
        newParams.set('page', `${nextPage}`)
        const searchQueryString = newParams.toString()
        router.replace(`${pathname}?${searchQueryString}`, { scroll: false })
        //setPage(nextPage)
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
    //setPage(1)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onReset = () => {
    //setPage(1)
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
