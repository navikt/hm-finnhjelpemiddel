'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

import AutocompleteSearch from '@/components/AutocompleteSearch'
import { logNavigationEvent, logVisit } from '@/utils/amplitude'
import { Bleed, Box, Heading, HGrid, VStack } from '@navikt/ds-react'
import KontaktOss from '@/app/forside/KontaktOss'
import FinnHjelpemiddelLogo from '@/app/forside/FinnHjelpemiddelLogo'
import Agreements from '@/app/forside/Agreements'
import { NewsFeed } from '@/app/forside/NewsFeed'
import styles from './FrontPage.module.scss'
import { OtherAgreements } from '@/app/forside/OtherAgreements'
import { logUmamiNavigationEvent, logUmamiVisit } from '@/utils/umami'

function FrontPage() {
  const path = usePathname()
  const router = useRouter()

  useEffect(() => {
    typeof window !== 'undefined' &&
      logVisit(window.location.href, window.document.title, 'forside') ||
      logUmamiVisit(window.location.href, window.document.title, 'forside')
  }, [])

  const onSearch = useCallback(
    (searchTerm: string) => {
      const qWithFilters = new URLSearchParams(window.location.search)
      const qNoFilters = new URLSearchParams()

      qWithFilters.set('term', searchTerm.trim())
      qNoFilters.set('term', searchTerm.trim())
      if (path.includes('sok')) {
        logNavigationEvent('søk', 'søk', 'Søk på søkesiden')
        logUmamiNavigationEvent('søk', 'søk', 'Søk på søkesiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path === '/') {
        logNavigationEvent('forside', 'søk', 'Søk på forsiden')
        logUmamiNavigationEvent('forside', 'søk', 'Søk på forsiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path.includes('produkt')) {
        router.push('/sok?' + qNoFilters.toString())
      } else {
        logNavigationEvent('annet', 'søk', 'Søk fra annen side')
        logUmamiNavigationEvent('annet', 'søk', 'Søk fra annen side')
        router.push('/sok?' + qWithFilters.toString())
      }
    },
    [router, path]
  )

  return (
    <VStack className={styles.container} paddingInline={{ xs: '4', md: '12' }} gap={{ xs: '12', md: '16' }}>
      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        <HGrid
          className={styles.heroContentContainer}
          columns={{ sm: 1, md: 2 }}
          align={'center'}
          gap={'8'}
          marginBlock={{ xs: '10', md: '20' }}
        >
          <VStack gap={{ xs: '8', md: '11' }} maxWidth={'490px'} style={{ gridArea: 'box1' }}>
            <Heading level="1" size="large">
              Her kan du finne hjelpemidler på det norske markedet
            </Heading>
            <Box>
              <AutocompleteSearch onSearch={onSearch} placeholder={'Søk etter hjelpemiddel eller HMS-nummer'} />
            </Box>
          </VStack>

          <Box className={styles.logoBox} style={{ gridArea: 'box2' }}>
            <Box width={{ xs: '300px', md: '360px' }}>
              <FinnHjelpemiddelLogo />
            </Box>
          </Box>
        </HGrid>
      </Bleed>

      <Agreements />
      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        <OtherAgreements />
      </Bleed>
      <NewsFeed />

      <KontaktOss />
    </VStack>
  )
}

export default FrontPage
