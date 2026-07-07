'use client'

import { Bleed, Button } from '@navikt/ds-react'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <Bleed marginInline={{md: 'space-64' }} asChild>
      <Button variant="tertiary" icon={<ArrowLeftIcon />} onClick={() => router.back()}>
        Tilbake
      </Button>
    </Bleed>
  )
}
