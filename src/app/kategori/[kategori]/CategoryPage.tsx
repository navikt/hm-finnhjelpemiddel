'use client'

import React from 'react'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Box, HGrid, HStack, ReadMore, VStack } from '@navikt/ds-react'
import CompareMenu from '@/components/layout/CompareMenu'
import { CategoryResults } from '../CategoryResults'
import { FilterBarCategory, Filters } from '@/app/kategori/filter/FilterBarCategory'
import useQueryString from '@/utils/search-params-util'
import { fetchProductsCategory } from '@/app/kategori/utils/kategori-inngang-util'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'
import { ProductsWithIsoAggs } from '@/app/kategori/utils/category-types'
import { logUmamiClickButton } from '@/utils/umami'
import useSWRImmutable from 'swr/immutable'

type Props = {
  category: CategoryDTO
  searchParams: { [key: string]: string | string[] | undefined }
}

export const CategoryPage = ({ category, searchParams }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  //const searchParams = useSearchParams()
  const { createQueryStringAppend } = useQueryString()


  const {
    data: productsData,
    error,
    isLoading,
  } = useSWRImmutable<ProductsWithIsoAggs>([pathname, searchParams.toString()], () =>
    fetchProductsCategory({
      from: 0,
      size: 1000,
      searchParams,
      category: category,
    })
  )

  const products = productsData?.products
  const isos = productsData?.iso.map((iso) => ({ key: iso.code, label: iso.name })) ?? []
  const suppliers = productsData?.suppliers.map((supplier) => supplier.name) ?? []
  const digitalSoknad = productsData?.digitalSoknad ?? []
  const bestillingsordning = productsData?.bestillingsordning ?? []
  const techDataFilterAggs = productsData?.techDataFilterAggs

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
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onReset = () => {
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

            <CategoryResults products={products} isLoading={isLoading} />
          </VStack>
        </HGrid>
      </>
    </CategoryPageLayout>
  )
}
