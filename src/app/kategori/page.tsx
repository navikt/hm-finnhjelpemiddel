import { kategorier, KategoriNavn } from '@/utils/kategori-mapping'
import { HGrid } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/CategoryCard'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'

export default async function Page() {
  const forsideKategorier: KategoriNavn[] = ['Bevegelse']

  return (
    <KategoriPageLayout title={'Her er alle kategoriene'} description={''}>
      <HGrid gap={'2'} columns={'repeat(2, 600px)'} paddingBlock={'12'}>
        <CategoryCard
          icon={kategorier['Alle'].ikon}
          title={kategorier['Alle'].navn}
          link={'sok'}
          description={kategorier['Alle'].beskrivelse}
          key={kategorier['Alle'].navn}
        />
        {forsideKategorier.map((kategori) => (
          <CategoryCard
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
