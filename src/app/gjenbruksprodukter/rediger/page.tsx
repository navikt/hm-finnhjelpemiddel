'use client'

import { Heading } from '@/components/aksel-client'
import styles from '../AlternativeProducts.module.scss'
import { Bleed, BodyShort, Box, HStack, Loader, Search, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { EditableAlternativeGroup } from '@/app/gjenbruksprodukter/rediger/EditableAlternativeGroup'
import { newGetAlternatives } from '@/app/gjenbruksprodukter/alternative-util'
import useSWR from 'swr'

export default function EditAlternativeProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = (value: string) => {
    router.push(`${pathname}?hms=${value}`)
  }

  return (
    <VStack gap={'4'} className={`${styles.container} main-wrapper--large`}>
      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        <VStack paddingBlock={'12'}>
          <Heading level="1" size="large" spacing>
            Rediger alternativer
          </Heading>

          <Box paddingBlock={'0 8'}>
            <BodyShort spacing>Søk opp et hms-nummer til klyngen med alternativer du vil redigere</BodyShort>
          </Box>

          <HStack gap={'7'} align={'end'} wrap={false}>
            <Search
              label={'HMS-nummer'}
              hideLabel={false}
              variant="primary"
              className={styles.search}
              onSearchClick={(value) => handleSearch(value)}
              onKeyUp={(event: React.KeyboardEvent) => {
                if (event.key === 'Enter') {
                  handleSearch((event.currentTarget as HTMLInputElement).value)
                }
              }}
            ></Search>
          </HStack>
        </VStack>
      </Bleed>

      {searchParams.has('hms') && <AlternativeGroupList hmsNumber={searchParams.get('hms')!} />}
    </VStack>
  )
}

const AlternativeGroupList = ({ hmsNumber }: { hmsNumber: string }) => {
  const {
    data: alternativesResponse,
    isLoading: isLoadingAlternatives,
    mutate: mutateAlternatives,
    error: errorAlternatives,
  } = useSWR(`asdasd-${hmsNumber}`, () => newGetAlternatives(hmsNumber))

  if (isLoadingAlternatives) {
    return <Loader />
  }

  if (errorAlternatives || !alternativesResponse) {
    return <>En feil har skjedd ved henting av data</>
  }

  if (!alternativesResponse.original) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  const alternatives = alternativesResponse.alternatives ?? []

  return (
    <EditableAlternativeGroup
      alternatives={[alternativesResponse.original, ...alternatives]}
      mutateAlternatives={mutateAlternatives}
    />
  )
}
