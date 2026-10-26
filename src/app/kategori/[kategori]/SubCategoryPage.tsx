'use client'
import { CategoryCardResponsive } from '@/app/kategori/CategoryCardResponsive'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'

import Link from 'next/link'
import NextLink from 'next/link'

import { Alert, Box, HGrid, ReadMore } from '@navikt/ds-react'

import { logUmamiClickButton, logUmamiNavigationEvent } from '@/utils/umami'

import { UXSignalsSurvey } from '@/components/UXSignalsSurvey'

export const SubCategoryPage = ({ category }: { category: CategoryDTO }) => {
  const subCategoryHelpText = 'Hvordan kan du låne hjelpemidler fra Nav? '
  const linkToNavHowToApply = 'https://www.nav.no/om-hjelpemidler#hvordan'
  const baseUrl = process.env.BUILD_ENV === 'prod' ? 'https://finnhjelpemiddel.nav.no' : ''
  return (
    <CategoryPageLayout title={category.title} description={category.data.description}>
      <Box maxWidth={'500px'}>
        <ReadMore
          variant={'moderate'}
          size={'large'}
          header={subCategoryHelpText}
          onOpenChange={(open) => {
            logUmamiClickButton(`${subCategoryHelpText}`, 'subcategory-readmore', `${open}`)
          }}
        >
          Om du har en varig funksjonsnedsettelse kan du søke om hjelpemidler fra Nav. I mange tilfeller kan det være
          nyttig å få hjelp av en fagperson i kommunen.
          <br />
          <br />
          Du kan lese mer under{' '}
          <Link
            href={baseUrl + '/om-nettstedet'}
            onClick={() => {
              logUmamiNavigationEvent('subcategory-readmore', linkToNavHowToApply, subCategoryHelpText)
            }}
          >
            «Vanlige spørsmål»
          </Link>
        </ReadMore>
      </Box>
      {category.title === 'Stå og gå' && <UXSignalsSurvey />}

      {category.subCategories?.length ? (
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
      ) : (
        <Alert variant="info">
          {category.isoVersion === 22
            ? 'Ingen treff for ISO 2022 i denne kategorien ennå.'
            : 'Ingen treff for ISO 2016 i denne kategorien.'}
        </Alert>
      )}
    </CategoryPageLayout>
  )
}
