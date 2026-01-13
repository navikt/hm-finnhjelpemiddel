'use client'

import useSWRImmutable from 'swr/immutable'
import { CategoryDTO, deleteCategory, getCategory } from '@/app/kategori/admin/category-admin-util'
import { Button, Heading, Loader, VStack } from '@navikt/ds-react'
import { useRouter } from 'next/navigation'

export const EditCategory = ({ id }: { id: string }) => {
  const router = useRouter()

  const { data: categoryDTO, isLoading, error } = useSWRImmutable<CategoryDTO>(id, () => getCategory(id))

  if (isLoading || !categoryDTO) {
    return <Loader size="small" />
  }

  const category = categoryDTO.data

  return (
    <VStack gap={'4'}>
      <Heading size={'medium'}>{category.name}</Heading>
      <Button
        style={{ width: 'fit-content' }}
        onClick={() => deleteCategory(categoryDTO.id).then(() => router.push('/kategori/admin'))}
      >
        Slett
      </Button>
    </VStack>
  )
}
