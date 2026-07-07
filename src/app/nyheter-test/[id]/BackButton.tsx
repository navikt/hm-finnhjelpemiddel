'use client'

import { Bleed, Button } from '@navikt/ds-react'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function BackButton() {
  const searchParams = useSearchParams()

  return (
    <Bleed marginInline={{ md: 'space-64' }} asChild>
      <Button
        as={NextLink}
        href={`/nyheter-test/aktuelt${searchParams.size ? `?${searchParams.toString()}` : ''}`}
        variant="tertiary"
        icon={<ArrowLeftIcon />}
      >
        Til aktuelt
      </Button>
    </Bleed>
  )
}
