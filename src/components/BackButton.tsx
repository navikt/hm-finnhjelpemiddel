'use client'

import { useRouter } from 'next/navigation'

import { ChevronLeftIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

import { toSearchQueryString } from '@/utils/product-util'
import { useHydratedSearchStore } from '@/utils/search-state-util'

export const BackButton = () => {
  const router = useRouter()

  const { searchData } = useHydratedSearchStore()

  const handleClick = () => {
    router.push('/sok' + toSearchQueryString(searchData))
  }

  return (
    <div className="back-button">
      <Button icon={<ChevronLeftIcon title="Gå tilbake" />} variant="tertiary" size="medium" onClick={handleClick}>
        Tilbake
      </Button>
    </div>
  )
}
