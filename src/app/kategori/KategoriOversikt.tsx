import { BodyShort, HGrid } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/CategoryCard'
import { kategorier, KategoriNavn } from '@/app/kategori/utils/mappings/kategori-mapping'
import { KategoriPageLayout } from '@/app/kategori/KategoriPageLayout'

export const KategoriOversikt = ({ kategori }: { kategori: KategoriNavn }) => {
  if (!kategorier[kategori]) {
    console.log('hei')
    return <BodyShort>Oiii</BodyShort>
  }

  return (
    <KategoriPageLayout title={kategorier[kategori].navn} description={kategorier[kategori].beskrivelse}>
      <HGrid gap={'2'} columns={'repeat(2, 600px)'} paddingBlock={'12'}>
        {kategorier[kategori].underkategorier.map((iso) => (
          <CategoryCard
            icon={kategorier[iso].ikon}
            title={kategorier[iso].navn}
            link={kategorier[iso].navn}
            description={kategorier[iso].beskrivelse}
            key={kategorier[iso].navn}
          />
        ))}
      </HGrid>
    </KategoriPageLayout>
  )
}
