'use client'

import AutocompleteSearch from '@/components/AutocompleteSearch'
import { logUmamiNavigationEvent } from '@/utils/umami'
import { Box } from '@navikt/ds-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export const FrontPageSearch = () => {
  const path = usePathname()
  const router = useRouter()

  const onSearch = useCallback(
    (searchTerm: string) => {
      const qWithFilters = new URLSearchParams(window.location.search)
      const qNoFilters = new URLSearchParams()

      qWithFilters.set('term', searchTerm.trim())
      qNoFilters.set('term', searchTerm.trim())
      if (path.includes('sok')) {
        logUmamiNavigationEvent('søk', 'søk', 'Søk på søkesiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path === '/') {
        logUmamiNavigationEvent('forside', 'søk', 'Søk på forsiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path.includes('produkt')) {
        router.push('/sok?' + qNoFilters.toString())
      } else {
        logUmamiNavigationEvent('annet', 'søk', 'Søk fra annen side')
        router.push('/sok?' + qWithFilters.toString())
      }
    },
    [router, path]
  )

  return (
    <Box>
      <AutocompleteSearch onSearch={onSearch} placeholder={'Søk etter hjelpemiddel eller HMS-nummer'} />
    </Box>
  )
}
