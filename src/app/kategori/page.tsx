import { topLevelcategories, topLevelCategoryTitles } from '@/app/kategori/utils/mappings/forside-kategori-mapping'
import { HGrid } from '@navikt/ds-react'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'
import { CategoryCardFrontPage } from '@/app/kategori/CategoryCardFrontPage'

export default async function Page() {
  return (
    <KategoriPageLayout title={'Her er alle kategoriene'} description={''}>
      <HGrid gap={"space-8"} columns={'repeat(2, 600px)'} paddingBlock={"space-48"}>
        {topLevelCategoryTitles.map((kategori) => (
          <CategoryCardFrontPage
            icon={topLevelcategories[kategori].icon}
            title={topLevelcategories[kategori].title}
            link={`kategori/${topLevelcategories[kategori].title}`}
            description={topLevelcategories[kategori].description}
            key={topLevelcategories[kategori].title}
          />
        ))}
      </HGrid>
    </KategoriPageLayout>
  );
}
