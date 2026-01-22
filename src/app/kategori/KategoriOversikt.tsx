import { Bleed, HGrid } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/CategoryCard'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'
import { CategoryDTO } from '@/app/kategori/admin/category-admin-util'

export const KategoriOversikt = ({ category }: { category: CategoryDTO }) => {
  return (
    <KategoriPageLayout title={category.title} description={category.data.description}>
      {category.subCategories?.length && (
        <Bleed style={{ backgroundColor: '#F5F9FF' }} reflectivePadding marginInline={'full'}>
          <HGrid gap={'4'} columns={{ xs: 1, md: 2 }} paddingBlock={'12 24'}>
            {category.subCategories
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((subCategory) => (
                <CategoryCard
                  //icon={subCategory.data.ikon}
                  title={subCategory.title}
                  link={subCategory.title}
                  key={subCategory.title}
                />
              ))}
          </HGrid>
        </Bleed>
      )}
    </KategoriPageLayout>
  )
}
