'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

import AutocompleteSearch from '@/components/AutocompleteSearch'
import { logNavigationEvent, logVisit } from '@/utils/amplitude'
import { Bleed, Box, Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import KontaktOss from '@/app/ny/KontaktOss'
import FinnHjelpemiddelLogo from '@/app/ny/FinnHjelpemiddelLogo'
import Agreements from '@/app/ny/Agreements'
import { NewsFeed } from '@/app/ny/NewsFeed'
import styles from './Ny.module.scss'

function FrontPage() {
  const path = usePathname()
  const router = useRouter()

  useEffect(() => {
    typeof window !== 'undefined' && logVisit(window.location.href, window.document.title, 'forside')
  }, [])

  const onSearch = useCallback(
    (searchTerm: string) => {
      const qWithFilters = new URLSearchParams(window.location.search)
      const qNoFilters = new URLSearchParams()

      qWithFilters.set('term', searchTerm.trim())
      qNoFilters.set('term', searchTerm.trim())
      if (path.includes('sok')) {
        logNavigationEvent('søk', 'søk', 'Søk på søkesiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path === '/') {
        logNavigationEvent('forside', 'søk', 'Søk på forsiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path.includes('produkt')) {
        router.push('/sok?' + qNoFilters.toString())
      } else {
        logNavigationEvent('annet', 'søk', 'Søk fra annen side')
        router.push('/sok?' + qWithFilters.toString())
      }
    },
    [router, path]
  )

  return (
    <div className="home-page">
      <VStack className="main-wrapper--large" gap={{ xs: '12', md: '16' }}>
        <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
          <HStack wrap={false} justify={'space-between'} align={'center'} marginBlock={{ xs: '10', md: '20' }}>
            <VStack gap={{ xs: '8', md: '11' }} maxWidth={'490px'}>
              <Heading level="1" size="large">
                Her kan du finne hjelpemidler på det norske markedet
              </Heading>
              <Box>
                <AutocompleteSearch onSearch={onSearch} />
              </Box>
            </VStack>

            <Hide below={'md'} asChild>
              <Box className={styles.logoBox}>
                <FinnHjelpemiddelLogo />
              </Box>
            </Hide>
          </HStack>
        </Bleed>

        <Agreements />
        <NewsFeed />

        <KontaktOss />
      </VStack>
    </div>
  )
}

export default FrontPage
