'use client'

import { CategoryList } from '@/app/kategori/admin/CategoryList'
import { CategoryDTO, getCategories } from '@/app/kategori/admin/category-admin-util'

import NextLink from 'next/link'

import useSWR from 'swr'

import { Bleed, Box, Button, Heading, Loader } from '@navikt/ds-react'

export const AdminPage = () => {
  const { data: categories, isLoading } = useSWR<CategoryDTO[]>('categories', () => getCategories())

  if (isLoading || !categories) {
    return <Loader size="small" />
  }

  return (
    <>
      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        <Box paddingBlock={'space-32'}>
          <Heading size={'large'}>Kategori-admin 🤠</Heading>
        </Box>
      </Bleed>
      <Button as={NextLink} href={'admin/ny'} style={{ width: 'fit-content' }}>
        Ny kategori
      </Button>
      <CategoryList categories={categories} />
    </>
  )
}
