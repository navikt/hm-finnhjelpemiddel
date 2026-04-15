'use client'

import { HGrid } from '@navikt/ds-react'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO, getCategoriesByIds } from '@/app/kategori/admin/category-admin-util'
import { CategoryCard } from '@/app/kategori/CategoryCard'
import useSWRImmutable from 'swr/immutable'

export default function Page() {
  const rootCategoryIds = [
    '26d532f8-df3b-4fa1-96f2-0c0db5d5c6f9', //Bevegelse
    'c0157c13-3644-4d4f-9efb-04bb596e833c', //Bolig
    '5be58783-8407-4e36-b97c-46eb8cf52b62', //Hygiene
    'c3cd28b1-5bd0-44e5-bf7c-ce7ca49d0086', //Sport og aktivitet
    '8afc903c-2e9a-4610-b76e-8e8469c21245', //Syn
    'b80fc53e-c670-4f4b-a2cf-b105cb6adfcb', //Hørsel
    '81718ac0-0f17-4c4a-a046-7fcd5bc1ee7f', //Kognisjon
    '5dbd4a7c-0992-439c-9b53-fea263a05ddd', //Kommunikasjon
  ]

  const { data: categories } = useSWRImmutable<CategoryDTO[]>('/category/ids/', () =>
    getCategoriesByIds(rootCategoryIds)
  )

  return (
    <CategoryPageLayout title={'Kategorier'} description={''}>
      <HGrid gap={'space-40'} columns={{ xs: 1, md: 2, lg: 3 }} paddingBlock={'space-0 space-96'}>
        {categories?.map((category) => (
          <CategoryCard
            icon={category.data.icon}
            title={category.title}
            link={`kategori/${category.title}`}
            description={category.data.description}
            key={category.title}
          />
        ))}
      </HGrid>
    </CategoryPageLayout>
  )
}
