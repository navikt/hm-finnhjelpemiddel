'use client'

import { Button, Heading, Loader, VStack } from '@navikt/ds-react'
import { CategoryDTO, getCategories } from '@/app/kategori/admin/category-admin-util'
import { CategoryList } from '@/app/kategori/admin/CategoryList'
import NextLink from 'next/link'
import useSWR from 'swr'

export const AdminPage = () => {
  const { data: categories, isLoading, error } = useSWR<CategoryDTO[]>('categories', () => getCategories())

  if (isLoading || !categories) {
    return <Loader size="small" />
  }

  return (
    <VStack gap={'8'}>
      <Heading size={'large'}>Kategori-admin 🤠</Heading>
      <Button as={NextLink} href={'admin/ny'} style={{ width: 'fit-content' }}>
        Ny kategori
      </Button>

      <CategoryList categories={categories} />
    </VStack>
  )
}
