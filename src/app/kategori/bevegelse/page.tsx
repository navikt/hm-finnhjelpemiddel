import { Bleed, BodyLong, Heading, HGrid, VStack } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/bevegelse/CategoryCard'
import { WheelchairIcon } from '@navikt/aksel-icons'
import { fetchIsoTree } from '@/utils/iso-util'

export default async function Page() {
  const isos = await fetchIsoTree()

  const level2 = Object.values(isos).filter((iso) => iso.isoCode.startsWith('12') && iso.isoLevel === 2)

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
          Bevegelse
        </Heading>
        <BodyLong style={{ maxWidth: '735px' }}>
          Her finner du hjelpemidler for aktiviteter og deltakelse relatert til personforflytning og transport.
        </BodyLong>
      </VStack>

      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        <div>
          <HGrid gap={'2'} columns={'repeat(2, 600px)'}>
            {level2.map((iso) => (
              <CategoryCard
                icon={icon1}
                title={iso.isoTitle}
                link={iso.isoCode}
                description={iso.isoTextShort}
                key={iso.isoCode}
              />
            ))}
          </HGrid>
        </div>
      </Bleed>
    </VStack>
  )
}
