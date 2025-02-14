'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

import AutocompleteSearch from '@/components/AutocompleteSearch'
import NewsList from '@/components/NewsList'
import { logNavigationEvent, logVisit } from '@/utils/amplitude'
import { Bleed, Box, Heading, HStack, VStack } from '@navikt/ds-react'
import KontaktOss from '@/app/ny/KontaktOss'
import { NavnoLinks } from '@/app/ny/NavnoLinks'
import Innganger from '@/app/ny/Innganger'
import Produktgrupper from '@/app/ny/Produktgrupper'
import FinnHjelpemiddelLogo from '@/app/ny/FinnHjelpemiddelLogo'
import Agreements from '@/app/ny/Agreements'
import { NewsFeed } from '@/app/ny/NewsFeed'

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
        <Bleed
          marginInline="full"
          reflectivePadding
          style={{ backgroundColor: '#FEF5EF' }}
          className="home-page__heading-and-search-container"
        >
          <HStack wrap={false}>
            <VStack gap={{ xs: '8', md: '11' }}>
              <Heading level="1" size="large">
                Her kan du finne hjelpemidler, tilbehør og reservedeler
              </Heading>
              <Box maxWidth={'530px'}>
                <AutocompleteSearch onSearch={onSearch} />
              </Box>
            </VStack>

            <Box>
              <FinnHjelpemiddelLogo />
            </Box>
          </HStack>
        </Bleed>

        <Innganger />
        <Produktgrupper />

        <Agreements />
        <NewsFeed />
        <NavnoLinks />

        <KontaktOss />
      </VStack>
    </div>
  )
}

export default FrontPage
