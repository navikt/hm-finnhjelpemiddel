'use client'

import {
  Category,
  CategoryDTO,
  deleteCategory,
  getCategory,
  updateCategory,
} from '@/app/kategori/admin/category-admin-util'
import { Alert, Button, Heading, HStack, Link, Loader, VStack } from '@navikt/ds-react'
import { useRouter } from 'next/navigation'
import { EditableCategory } from '@/app/kategori/admin/EditableCategory'
import { useState } from 'react'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import styles from './EditCategory.module.scss'
import NextLink from 'next/link'
import useSWRImmutable from 'swr/immutable'
import { KeyedMutator } from 'swr'

export const EditCategoryPage = ({ id }: { id: string }) => {
  const { data: categoryDTO, mutate, isLoading, error } = useSWRImmutable<CategoryDTO>(id, () => getCategory(id))

  if (error) {
    return <Alert variant={'error'}>Det har skjedd en feil ved henting av kategorien</Alert>
  }
  if (isLoading || !categoryDTO) {
    return <Loader size="small" />
  }
  return <EditCategory categoryDTO={categoryDTO} mutate={mutate} />
}

export const EditCategory = ({
  categoryDTO,
  mutate,
}: {
  categoryDTO: CategoryDTO
  mutate: KeyedMutator<CategoryDTO>
}) => {
  const router = useRouter()
  const [inputValue, setInputValue] = useState<Category>(categoryDTO.data)
  const [saved, setSaved] = useState<boolean>(false)

  return (
    <VStack gap={'2'}>
      <Link as={NextLink} href={'/kategori/admin'} style={{ width: 'fit-content' }}>
        <ArrowLeftIcon aria-hidden />
        Tilbake til oversikt
      </Link>

      <Heading size={'large'}>Rediger kategori</Heading>

      <EditableCategory inputValue={inputValue} setInputValue={setInputValue} id={categoryDTO.id} />

      <HStack gap={'6'}>
        <Button
          variant={'danger'}
          style={{ width: 'fit-content' }}
          onClick={() => deleteCategory(categoryDTO.id).then(() => router.push('/kategori/admin'))}
        >
          Slett
        </Button>
        <Button
          className={saved ? styles.buttonSaved : styles.button}
          onBlur={() => setSaved((prev) => !prev)}
          onClick={() =>
            saved
              ? setSaved(false)
              : updateCategory({ ...categoryDTO, data: inputValue })
                  .then(() => mutate({ ...categoryDTO, data: inputValue }))
                  .finally(() => setSaved(true))
          }
        >
          {saved ? 'Lagret!' : 'Lagre'}
        </Button>
      </HStack>
    </VStack>
  )
}
