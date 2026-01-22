import { CategoryAdminDTO } from '@/app/kategori/admin/category-admin-util'
import { Box, Heading, HGrid, Link, Search, VStack } from '@navikt/ds-react'
import styles from './CategoryList.module.scss'
import NextLink from 'next/link'
import React, { useState } from 'react'

export const CategoryList = ({ categories }: { categories: CategoryAdminDTO[] }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const filteredCategories = categories
    .filter((category) => category.title.includes(searchTerm))
    .sort((a, b) => a.title.localeCompare(b.title))

  return (
    <Box>
      <Heading size={'medium'} spacing>
        Alle kategorier
      </Heading>
      <VStack maxWidth={'400px'}>
        <Search
          label="Søk"
          variant="simple"
          clearButton={true}
          placeholder="Søk etter kategorinavn"
          size="medium"
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          hideLabel={true}
        />
        {filteredCategories.map((category) => (
          <CategoryCard category={category} key={category.id} />
        ))}
      </VStack>
    </Box>
  )
}

const CategoryCard = ({ category }: { category: CategoryAdminDTO }) => {
  return (
    <HGrid className={styles.categoryCard}>
      <Link as={NextLink} href={`admin/${category.id}`}>
        {category.title}
      </Link>
    </HGrid>
  )
}
