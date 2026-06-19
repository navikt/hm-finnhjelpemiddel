'use client'

import { Bleed, Box, Button, Heading, Loader } from '@navikt/ds-react'
import { CategoryAdminDTO, getCategories } from '@/app/kategori/admin/category-admin-util'
import { CategoryList } from '@/app/kategori/admin/CategoryList'
import NextLink from 'next/link'
import useSWR from 'swr'

export const AdminPage = () => {
  const { data: categories, isLoading } = useSWR<CategoryAdminDTO[]>('categories', () => getCategories())

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
