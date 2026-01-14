'use client'

import { Button, Heading, Link, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Category, createCategory } from '@/app/kategori/admin/category-admin-util'
import { useRouter } from 'next/navigation'
import { EditableCategory } from '@/app/kategori/admin/EditableCategory'
import NextLink from 'next/link'
import { ArrowLeftIcon } from '@navikt/aksel-icons'

export const NewCategory = () => {
  const router = useRouter()

  const [inputValue, setInputValue] = useState<Category>({
    name: '',
    description: '',
    subCategories: [],
    isos: [],
    showProducts: false,
  })

  const onSave = () => {
    return createCategory({
      data: inputValue,
    })
  }

  return (
    <VStack gap={'2'}>
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
