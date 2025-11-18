import { Bleed, BodyLong, Heading, HGrid, VStack } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/bevegelse/CategoryCard'
import { WheelchairIcon } from '@navikt/aksel-icons'
import { fetchIsoTree } from '@/utils/iso-util'

export default async function Page() {
  const isos = await fetchIsoTree()

  console.log(Object.keys(isos).length)

  const level1 = Object.entries(isos).filter(([key, iso]) => iso.isoLevel === 1)
  console.log(level1)

  const icon1 = <WheelchairIcon fontSize={'5rem'} />
  const title1 = 'Manuelle rullestoler'
  const link1 = '1222'
  const description1 =
    'Rullestoler som manøvreres ved at den som sitter i stolen, bruker begge hender på dekkene eller på hjulenes drivringer. Omfatter f.eks. framhjulsdrevne og bakhjulsdrevne rullestoler.'

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
            <CategoryCard icon={icon1} title={title1} link={link1} description={description1} />
            <CategoryCard icon={icon1} title={title1} link={link1} description={description1} />
            <CategoryCard icon={icon1} title={title1} link={link1} description={description1} />
            <CategoryCard icon={icon1} title={title1} link={link1} description={description1} />
          </HGrid>
        </div>
      </Bleed>
    </VStack>
  )
}
