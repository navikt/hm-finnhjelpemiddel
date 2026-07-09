'use client'

import { Bleed, Link } from '@navikt/ds-react'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function BackButton() {
  const searchParams = useSearchParams()

  return (
    <Bleed marginInline={{ md: 'space-20' }} asChild>
      <Link
        as={NextLink}
        href={`/aktuelt${searchParams.size ? `?${searchParams.toString()}` : ''}`}
      >
        <ArrowLeftIcon />
        Til aktuelt
      </Link>
    </Bleed>
  )
}
