import { Bleed, Box, Heading, HGrid, VStack } from '@navikt/ds-react'
import FinnHjelpemiddelLogo from '@/app/forside/FinnHjelpemiddelLogo'
import Agreements from '@/app/forside/Agreements'
import styles from './FrontPage.module.scss'
import { OtherAgreements } from '@/app/forside/OtherAgreements'
import { KategoriInngangForside } from '@/app/forside/KategoriInngangForside'
import { FrontPageSearch } from '@/app/FrontPageSearch'
import NewsFeed from '@/app/forside/NewsFeed'

function FrontPage() {
  return (
    <VStack
      className={styles.container}
      paddingInline={{ xs: 'space-16', md: 'space-48' }}
      gap={{ xs: 'space-36', md: 'space-32' }}
    >
      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        <HGrid
          className={styles.heroContentContainer}
          columns={{ sm: 1, md: 2 }}
          align={'center'}
          gap={'space-32'}
          marginBlock={{ xs: 'space-20', md: 'space-40' }}
        >
          <VStack gap={{ xs: 'space-32', md: 'space-44' }} maxWidth={'490px'} style={{ gridArea: 'box1' }}>
            <Heading level="1" size="large">
              Her kan du finne hjelpemidler på det norske markedet
            </Heading>
            <FrontPageSearch />
          </VStack>

          <Box className={styles.logoBox} style={{ gridArea: 'box2' }}>
            <Box width={{ xs: '300px', md: '360px' }}>
              <FinnHjelpemiddelLogo />
            </Box>
          </Box>
        </HGrid>
      </Bleed>
      <KategoriInngangForside />
      <HGrid
        columns={{ xs: 1, lg: '4fr 1fr' }}
        gap={{ md: 'space-128' }}
        align="start"
        paddingBlock={{ md: 'space-56 space-0' }}
      >
        <Agreements />
        <NewsFeed />
      </HGrid>
      <Bleed marginInline="full" reflectivePadding style={{ marginBottom: '1.5rem' }}>
        <OtherAgreements />
      </Bleed>
    </VStack>
  )
}

export default FrontPage
