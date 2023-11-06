'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { ChevronLeftIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

import { mapProductSearchParams, toSearchQueryString } from '@/utils/product-util'
import { useMemo } from 'react'

export const BackButton = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapProductSearchParams(searchParams), [searchParams])

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
