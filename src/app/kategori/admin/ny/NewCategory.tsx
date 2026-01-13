'use client'

import { Button, Heading, TextField, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { createCategory, Category } from '@/app/kategori/admin/category-admin-util'
import { useRouter } from 'next/navigation'

export const NewCategory = () => {
  const router = useRouter()

  const [inputValue, setInputValue] = useState<Category>({
    name: '',
    description: '',
  })

  const onSave = () => {
    return createCategory({
      data: inputValue,
    })
  }

  return (
    <VStack gap={'8'} maxWidth={'800px'} paddingBlock={'4 12'}>
      <Heading size={'large'}>Ny kategori</Heading>
      <VStack gap={'4'} maxWidth={'300px'}>
        <TextField
          label="tittel"
          defaultValue={inputValue.name}
          onChange={(event) => setInputValue({ ...inputValue, name: event.currentTarget.value })}
        />
        <Button onClick={() => onSave().then(() => router.push('/kategori/admin'))}>Lagre</Button>
      </VStack>
    </VStack>
  )
}
