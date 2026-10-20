'use client'
import { CategoryCardResponsive } from '@/app/kategori/CategoryCardResponsive'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'

import { IsoVersion } from '@/app/kategori/utils/iso-version'

import Link from 'next/link'

import { Alert, Box, HGrid, ReadMore } from '@navikt/ds-react'

import { logUmamiClickButton, logUmamiNavigationEvent } from '@/utils/umami'

import { UXSignalsSurvey } from '@/components/UXSignalsSurvey'

export const SubCategoryPage = ({ category, isoVersion }: { category: CategoryDTO; isoVersion?: IsoVersion }) => {
  const subCategoryHelpText = 'Hvordan kan du låne hjelpemidler fra Nav? '
  const linkToNavHowToApply = 'https://www.nav.no/om-hjelpemidler#hvordan'
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
          Om du har varige funksjonsvansker kan du søke om hjelpemidler fra Nav.
          <br />
          I mange tilfeller kan det være nyttig å få hjelp av en fagperson i kommunen.
          <br />
          <br />
          Du kan lese mer hva du kan få og hvordan du skal søke under «Slik går du frem» på nav.no{' '}
          <Link
            href={linkToNavHowToApply}
            aria-label={`Gå til ${subCategoryHelpText}`}
            onClick={() => {
              logUmamiNavigationEvent('subcategory-readmore', linkToNavHowToApply, subCategoryHelpText)
            }}
          >
            Informasjon om hjelpemidler og tilrettelegging - nav.no.
          </Link>
        </ReadMore>
      </Box>
      {category.title === 'Stå og gå' && <UXSignalsSurvey />}

      {isoVersion === 22 && !category.subCategories?.length && (
        <Alert variant="info" inline>
          Ingen treff for ISO 2022 i denne kategorien ennå.
        </Alert>
      )}

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
                isoVersion={isoVersion}
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
