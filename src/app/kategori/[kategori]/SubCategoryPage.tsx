'use client'
import { CategoryCardResponsive } from '@/app/kategori/CategoryCardResponsive'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'

import React from 'react'

import { BodyLong, Box, HGrid, Link, ReadMore } from '@navikt/ds-react'

import { logUmamiClickButton } from '@/utils/umami'

import { UXSignalsSurvey } from '@/components/UXSignalsSurvey'

export const SubCategoryPage = ({ category }: { category: CategoryDTO }) => {
  const subCategoryHelpText = 'Hvordan kan du låne hjelpemidler fra Nav?'
  return (
    <CategoryPageLayout title={category.title} description={category.data.description}>
      <Box maxWidth={'700px'}>
        <ReadMore
          variant={'moderate'}
          size={'large'}
          header={subCategoryHelpText}
          onOpenChange={(open) => {
            logUmamiClickButton(`${subCategoryHelpText}`, 'subcategory-readmore', `${open}`)
          }}
        >
          <BodyLong>Om du har varige funksjonsvansker kan du søke om hjelpemidler fra Nav. </BodyLong>
          <BodyLong spacing>I mange tilfeller kan det være nyttig å få hjelp av en fagperson i kommunen.</BodyLong>
          <Link href={'/om-nettstedet'}>Les mer om om å låne hjelpemidler fra Nav her.</Link>
        </ReadMore>
      </Box>
      {category.title === 'Stå og gå' && <UXSignalsSurvey />}

      {category.subCategories?.length && (
        <HGrid
          gap={{ xs: 'space-16', md: 'space-40' }}
          columns={{ xs: 1, md: 2, lg: 3 }}
          paddingBlock={'space-0 space-96'}
        >
          {category.subCategories
            .sort((a, b) => a.priority - b.priority)
            .map((subCategory) => (
              <CategoryCardResponsive
                icon={subCategory.icon}
                title={subCategory.title}
                link={subCategory.title}
                key={subCategory.title}
                showSubCategoryIcons={category.data.showSubCategoryIcons}
                description={subCategory.description}
              />
            ))}
        </HGrid>
      )}
    </CategoryPageLayout>
  )
}
