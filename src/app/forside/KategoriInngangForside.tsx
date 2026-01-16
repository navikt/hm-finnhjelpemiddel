'use client'

import { Heading, HGrid, VStack } from '@navikt/ds-react'
import { CategoryCard } from '@/app/kategori/CategoryCard'
import { BevegelseIkon } from '@/app/kategori/ikoner/BevegelseIkon'
import { useState } from 'react'
import { getCookie } from '@/app/layoutProvider'

export const KategoriInngangForside = () => {
  const [consent] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return getCookie('finnhjelpemiddel-consent')
    } else {
      return 'pending'
    }
  })

  return (
    <VStack gap={'4'} paddingInline={{ lg: '6' }}>
      <Heading level={'2'} size={'large'}>
        Kategori-inngang
      </Heading>
      <HGrid gap={'4'} columns={{ xs: 1, md: 2 }} paddingBlock={'2 0'} maxWidth={'700px'}>
        <CategoryCard title={'Bevegelse'} link={'/kategori/Bevegelse'} icon={BevegelseIkon()} />
      </HGrid>
    </VStack>
  )
}
