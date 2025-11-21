import { Bleed, BodyLong, Heading, HGrid, VStack } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/CategoryCard'
import { WheelchairIcon } from '@navikt/aksel-icons'
import { fetchIsoTree } from '@/utils/iso-util'
import { bevegelse, kategorier, KategoriNavn } from '@/utils/kategori-mapping'

export default async function Page() {
  //const isos = await fetchIsoTree()

  //const level2 = Object.values(isos).filter((iso) => iso.isoCode.startsWith('12') && iso.isoLevel === 2)

  const kategori: KategoriNavn = 'Bevegelse'

  const icon1 = <WheelchairIcon fontSize={'5rem'} />
  return (
    <VStack
      gap={'14'}
      paddingBlock={'16'}
      paddingInline={'4'}
      marginInline={'auto'}
      marginBlock={'0'}
      maxWidth={'1440px'}
    >
      <VStack gap="4">
        <Heading level="1" size="large">
          {kategorier[kategori].navn}
        </Heading>
        <BodyLong style={{ maxWidth: '735px' }}>{kategorier[kategori].beskrivelse}</BodyLong>
      </VStack>

      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        <HGrid gap={'2'} columns={'repeat(2, 600px)'} paddingBlock={'12'}>
          {bevegelse.underkategorier.map((iso) => (
            <CategoryCard
              icon={icon1}
              title={kategorier[iso].navn}
              link={kategorier[iso].navn}
              description={kategorier[iso].beskrivelse}
              key={kategorier[iso].navn}
            />
          ))}
        </HGrid>
      </Bleed>
    </VStack>
  )
}
