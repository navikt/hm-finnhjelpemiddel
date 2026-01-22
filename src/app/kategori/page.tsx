import { kategorier, KategoriNavn } from '@/app/kategori/utils/mappings/kategori-mapping'
import { HGrid } from '@navikt/ds-react'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'
import { CategoryCardFrontPage } from '@/app/kategori/CategoryCardFrontPage'

export default async function Page() {
  const forsideKategorier: KategoriNavn[] = ['Bevegelse']

  return (
    <KategoriPageLayout title={'Her er alle kategoriene'} description={''}>
      <HGrid gap={'2'} columns={'repeat(2, 600px)'} paddingBlock={'12'}>
        <CategoryCardFrontPage
          icon={kategorier['Alle'].ikon}
          title={kategorier['Alle'].navn}
          link={'sok'}
          description={kategorier['Alle'].beskrivelse}
          key={kategorier['Alle'].navn}
        />
        {forsideKategorier.map((kategori) => (
          <CategoryCardFrontPage
            icon={kategorier[kategori].ikon}
            title={kategorier[kategori].navn}
            link={`kategori/${kategorier[kategori].navn}`}
            description={kategorier[kategori].beskrivelse}
            key={kategorier[kategori].navn}
          />
        ))}
      </HGrid>
    </KategoriPageLayout>
  )
}
