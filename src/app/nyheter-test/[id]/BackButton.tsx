'use client'

import { Button } from '@navikt/ds-react'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <Button
      variant="tertiary"
      size="small"
      icon={<ArrowLeftIcon aria-hidden />}
      onClick={() => router.back()}
    >
      Tilbake
    </Button>
  )
}
