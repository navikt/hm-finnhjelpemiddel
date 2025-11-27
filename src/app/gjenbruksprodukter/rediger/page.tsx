'use client'

import { Heading } from '@/components/aksel-client'
import styles from '../AlternativeProducts.module.scss'
import { Bleed, BodyShort, Box, HelpText, HStack, Loader, Search, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { EditableAlternativeGroup } from '@/app/gjenbruksprodukter/rediger/EditableAlternativeGroup'
import { getAlternativesGrouped } from '@/app/gjenbruksprodukter/alternative-util'
import useSWR from 'swr'
import { NoAlternativesCard } from '@/app/gjenbruksprodukter/rediger/NoAlternativesCard'

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
  } = useSWR(`alternatives-groups-${hmsNumber}`, () => getAlternativesGrouped(hmsNumber))

  if (isLoadingAlternatives) {
    return <Loader />
  }

  if (errorAlternatives || !alternativesResponse) {
    return <Box>En feil har skjedd ved henting av data</Box>
  }

  if (!alternativesResponse.original) {
    return <>Finner ikke produkt {hmsNumber}</>
  }

  const groups = alternativesResponse.groups ?? []

  if (groups.length > 1) {
    return (
      <HStack gap="space-8">
        <HStack gap="2">
          Det finnes flere klynger med alternativer for produktet
          <HelpText title="Forklaring av alternativgrupper">
            Når et produkt har flere klynger med alternativer betyr det at det finnes ulike sett av produkter som kan
            brukes som erstatninger, men at alle produktene i alle klyngene ikke kan erstatte hverandre.
          </HelpText>
        </HStack>
        {groups.map((group, index) => (
          <Box key={index} paddingBlock="space-8">
            <Heading level="2" size="medium" spacing>
              Klynge {index + 1}
            </Heading>
            <EditableAlternativeGroup
              originalProduct={alternativesResponse.original}
              alternatives={group}
              mutateAlternatives={mutateAlternatives}
            />
          </Box>
        ))}
      </HStack>
    )
  } else if (groups.length === 0) {
    return (
      <Box>
        <EditableAlternativeGroup
          originalProduct={alternativesResponse.original}
          alternatives={[]}
          mutateAlternatives={mutateAlternatives}
        />
      </Box>
    )
  }

  return groups.map((group, index) => (
    <Box key={index} paddingBlock="space-8">
      <EditableAlternativeGroup
        originalProduct={alternativesResponse.original}
        alternatives={group}
        mutateAlternatives={mutateAlternatives}
      />
    </Box>
  ))
}
