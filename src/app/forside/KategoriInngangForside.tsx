'use client'

import { Heading, HGrid, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { getCookie } from '@/app/layoutProvider'
import { CategoryCardFrontPage } from '@/app/kategori/CategoryCardFrontPage'
import { frontPageCategories, frontPageTitles } from '@/app/kategori/utils/mappings/forside-kategori-mapping'

export const KategoriInngangForside = () => {
  const [consent] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return getCookie('finnhjelpemiddel-consent')
    } else {
      return 'pending'
    }
  })

  return (
    <VStack gap={"space-16"} paddingInline={{ lg: "space-24" }}>
      <Heading level={'2'} size={'large'}>
        Kategorier
      </Heading>
      <HGrid gap={"space-28"} columns={{ xs: 1, md: 2 }} paddingBlock={"space-8 space-0"}>
        {frontPageTitles.map((value) => (
          <CategoryCardFrontPage
            key={value + '-card'}
            title={value}
            link={`/kategori/${value}`}
            icon={frontPageCategories[value].icon}
          />
        ))}
      </HGrid>
    </VStack>
  );
}
