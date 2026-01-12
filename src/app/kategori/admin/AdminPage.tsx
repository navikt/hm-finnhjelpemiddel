'use client'

import { BodyShort, VStack } from '@navikt/ds-react'
import useSWRImmutable from 'swr/immutable'
import { Category, getCategories } from '@/app/kategori/category-util'

export const AdminPage = () => {
  const { data, isLoading, error } = useSWRImmutable<Category[]>('categories', () => getCategories())

  return (
    <VStack gap={'4'}>
      <BodyShort>Kategori-admin</BodyShort>
      <BodyShort>Kategorier: {data?.length}</BodyShort>
    </VStack>
  )
}
