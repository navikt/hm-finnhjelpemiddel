import { HGrid } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/CategoryCard'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'
import { UXSignalsSurvey } from '@/components/UXSignalsSurvey'

export const KategoriOversikt = ({ category }: { category: CategoryDTO }) => {
  return (
    <KategoriPageLayout title={category.title} description={category.data.description}>
      <UXSignalsSurvey />

      {category.subCategories?.length && (
        <HGrid gap={'space-16'} columns={{ xs: 1, md: 2 }} paddingBlock={'space-0 space-96'}>
          {category.subCategories
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((subCategory) => (
              <CategoryCard
                icon={subCategory.icon}
                title={subCategory.title}
                link={subCategory.title}
                key={subCategory.title}
                showSubCategoryIcons={category.data.showSubCategoryIcons}
              />
            ))}
        </HGrid>
      )}
    </KategoriPageLayout>
  )
}
