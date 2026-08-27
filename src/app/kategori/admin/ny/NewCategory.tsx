'use client'

import { EditableCategory } from '@/app/kategori/admin/EditableCategory'
import { EditableCategoryDTO, createCategory } from '@/app/kategori/admin/category-admin-util'

import { useState } from 'react'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import { ArrowLeftIcon } from '@navikt/aksel-icons'
import { Button, Heading, Link, VStack } from '@navikt/ds-react'

export const NewCategory = () => {
  const router = useRouter()

  const [inputValue, setInputValue] = useState<EditableCategoryDTO>({
    title: '',
    data: {
      description: '',
      subCategories: [],
      isos: [],
      filters: [],
      icon: '',
      showSubCategoryIcons: true,
    },
    subcategories: [],
  })

  const onSave = () => {
    return createCategory(inputValue)
  }

  return (
    <VStack gap={'space-8'}>
      <Link as={NextLink} href={'/kategori/admin'} style={{ width: 'fit-content' }}>
        <ArrowLeftIcon aria-hidden />
        Tilbake til oversikt
      </Link>
      <Heading size={'large'}>Ny kategori</Heading>
      <EditableCategory inputValue={inputValue} setInputValue={setInputValue} />
      <Button onClick={() => onSave().then(() => router.push('/kategori/admin'))} style={{ width: 'fit-content' }}>
        Lagre
      </Button>
    </VStack>
  )
}
