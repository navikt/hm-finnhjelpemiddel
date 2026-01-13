import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'
import { HGrid, Link, VStack } from '@navikt/ds-react'
import styles from './CategoryList.module.scss'
import NextLink from 'next/link'
import React from 'react'

export const CategoryList = ({ categories }: { categories: CategoryDTO[] }) => {
  return (
    <VStack maxWidth={'400px'}>
      {categories.map((category) => (
        <CategoryCard category={category} key={category.id} />
      ))}
    </VStack>
  )
}

const CategoryCard = ({ category }: { category: CategoryDTO }) => {
  return (
    <HGrid className={styles.categoryCard}>
      <Link as={NextLink} href={`admin/${category.id}`}>
        {category.data.name}
      </Link>
    </HGrid>
  )
}
