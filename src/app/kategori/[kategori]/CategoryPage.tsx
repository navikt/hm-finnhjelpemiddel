//'use client'

import React from 'react'
import { Box, HGrid, HStack, ReadMore, VStack } from '@navikt/ds-react'
import { CategoryResults } from '../CategoryResults'
import { FilterBarCategory, Filters } from '@/app/kategori/filter/FilterBarCategory'
import { fetchProductsCategory } from '@/app/kategori/utils/kategori-inngang-util'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'
import { CategoryReadMore } from '@/app/kategori/[kategori]/CategoryReadMore'

type Props = {
  category: CategoryDTO
  searchParams: Map<string, (string | undefined)[]>
}

export const CategoryPage = async ({ category, searchParams }: Props) => {
  const productsData = await fetchProductsCategory({
    from: 0,
    size: 1000,
    //searchParams,
    searchParams,
    category: category,
  })

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

  return (
    <CategoryPageLayout title={category.title} description={category.data.description} error={false}>
      <>
        <HGrid columns={'374px 4'} gap={'space-16'}>
          <CategoryReadMore />
          <VStack gap={'space-16'}>
            <HStack justify={'space-between'} gap={'space-8'} align={'end'}>
              <FilterBarCategory filters={filters} />
            </HStack>

            <CategoryResults products={products} />
          </VStack>
        </HGrid>
      </>
    </CategoryPageLayout>
  )
}
