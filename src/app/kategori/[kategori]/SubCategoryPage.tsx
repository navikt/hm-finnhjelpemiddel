'use client'
import { CategoryCardResponsive } from '@/app/kategori/CategoryCardResponsive'
import { CategoryPageLayout } from '@/app/kategori/CategoryPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'

import { Box, HGrid, Link, ReadMore } from '@navikt/ds-react'

import { logUmamiClickButton, logUmamiNavigationEvent } from '@/utils/umami'

import { UXSignalsSurvey } from '@/components/UXSignalsSurvey'

export const SubCategoryPage = ({ category }: { category: CategoryDTO }) => {
  const subCategoryHelpText = 'Hvordan kan du låne hjelpemidler fra Nav?'
  const linkToNavHowToApply = 'https://www.nav.no/om-hjelpemidler'
  const linkToMedlemskapFolketrygden =
    'https://www.nav.no/no/person/flere-tema/arbeid-og-opphold-i-norge/relatert-informasjon/medlemskap-i-folketrygden'
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
          De viktigste vilkårene som må være oppfylt er:
          <ul>
            <li>Funksjonsvanskene må være varige. Det vil si at vanskene har en varighet på over to år.</li>
            <li>Hjelpemiddelet skal kompensere for funksjonstap.</li>
            <li>
              Man må ha{' '}
              <Link
                href={linkToMedlemskapFolketrygden}
                onClick={() => {
                  logUmamiNavigationEvent('subcategory-readmore', linkToMedlemskapFolketrygden, subCategoryHelpText)
                }}
              >
                medlemskap i folketrygden (nav.no).
              </Link>
            </li>
          </ul>
          Kommunen kan hjelpe deg med å finne de hjelpemidlene som passer best for deg, og med å utforme søknaden. Har
          du behov for hjelpemidler i en begrenset periode, kan du låne dem direkte fra kommunen.
          <br />
          <br />
          <Link
            href={linkToNavHowToApply}
            aria-label={`Gå til ${subCategoryHelpText}`}
            onClick={() => {
              logUmamiNavigationEvent('subcategory-readmore', linkToNavHowToApply, subCategoryHelpText)
            }}
          >
            Du finner mer informasjon om hjelpemidler og tilrettelegging på nav.no.
          </Link>
        </ReadMore>
      </Box>
      <UXSignalsSurvey />

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
