'use client'
import { Box, HGrid, ReadMore } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/CategoryCard'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'
import { UXSignalsSurvey } from '@/components/UXSignalsSurvey'
import Link from 'next/link'
import { logUmamiClickButton, logUmamiNavigationEvent } from '@/utils/umami'

export const SubCategoryPage = ({ category }: { category: CategoryDTO }) => {
  const subCategoryHelpText = 'Hvordan kan du få hjelpemidler?'
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
          Dersom du har en varig og vesentlig nedsatt funksjon på grunn av sykdom, skade eller annen tilstand, kan du
          søke om hjelpemidler fra Nav.
          <br />
          <br />
          I mange tilfeller er det nyttig å samarbeide med en fagperson i kommunen for å komme frem til det til det mest
          hensiktsmessige hjelpemidlet, og å skrive selve søknaden.
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
      <UXSignalsSurvey />

      {category.subCategories?.length && (
        <HGrid gap={'space-40'} columns={{ xs: 1, md: 2, lg: 3 }} paddingBlock={'space-0 space-96'}>
          {category.subCategories
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((subCategory) => (
              <CategoryCard
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
