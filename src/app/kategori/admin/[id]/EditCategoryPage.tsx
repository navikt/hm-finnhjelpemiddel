'use client'

import {
  deleteCategory,
  EditableCategoryDTO,
  getCategoryById,
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
  const {
    data: categoryDTO,
    mutate,
    isLoading,
    error,
  } = useSWRImmutable<EditableCategoryDTO>(id, () => getCategoryById(id))

  if (error) {
    return <Alert variant={'error'}>Det har skjedd en feil ved henting av kategorien</Alert>
  }
  if (isLoading || !categoryDTO) {
    return <Loader size="small" />
  }
  return <EditCategory categoryDTO={categoryDTO} mutate={mutate} id={id} />
}

export const EditCategory = ({
  categoryDTO,
  id,
  mutate,
}: {
  categoryDTO: EditableCategoryDTO
  id: string
  mutate: KeyedMutator<EditableCategoryDTO>
}) => {
  const router = useRouter()
  const [inputValue, setInputValue] = useState<EditableCategoryDTO>(categoryDTO)
  const [saved, setSaved] = useState<boolean>(false)
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  return (
    <VStack gap={"space-8"}>
      <Link as={NextLink} href={'/kategori/admin'} style={{ width: 'fit-content' }}>
        <ArrowLeftIcon aria-hidden />
        Tilbake til oversikt
      </Link>
      <Heading size={'large'}>Rediger kategori</Heading>
      <EditableCategory inputValue={inputValue} setInputValue={setInputValue} id={id} />
      <HStack gap={"space-24"}>
        <Button
          variant={confirmDelete ? 'danger' : 'secondary'}
          className={styles.deleteButton}
          onBlur={() => setConfirmDelete(false)}
          onClick={() =>
            confirmDelete ? deleteCategory(id).then(() => router.push('/kategori/admin')) : setConfirmDelete(true)
          }
        >
          {confirmDelete ? 'Bekreft' : 'Slett'}
        </Button>
        <Button
          className={saved ? styles.buttonSaved : styles.button}
          onBlur={() => setSaved(false)}
          onClick={() =>
            saved
              ? setSaved(false)
              : updateCategory(inputValue)
                  .then(() => mutate(inputValue))
                  .finally(() => setSaved(true))
          }
        >
          {saved ? 'Lagret!' : 'Lagre'}
        </Button>
      </HStack>
    </VStack>
  );
}
