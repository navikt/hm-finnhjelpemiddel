'use client'

import { Heading } from '@/components/aksel-client'
import styles from './AlternativeProducts.module.scss'
import { Bleed, BodyShort, Box, HStack, Search, Select, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AlternativeProductList } from '@/app/gjenbruksprodukter/AlternativeProductsList'
import { logNavigationEvent } from '@/utils/amplitude'
import { faro } from '@grafana/faro-core'
import { WarehouseStockResponse } from '@/utils/response-types'

export interface ProductStockResponse {
  hmsArtNr: string
  warehouseStock: WarehouseStockResponse[]
}

export interface AlternativeStockResponse {
  original: ProductStockResponse
  alternatives: ProductStockResponse[]
}

export default function AlternativeProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const localStorageWarehouseKey = 'selectedWarehouse'
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>()

  const warehouseNames = [
    'Østfold',
    'Oslo',
    'Hedmark',
    'Oppland',
    'Buskerud',
    'Vestfold',
    'Aust-Agder',
    'Vest-Agder',
    'Rogaland',
    'Hordaland',
    'Sogn og Fjordane',
    'Møre og Romsdal',
    'Sør-Trøndelag',
    'Nord-Trøndelag',
    'Nordland',
    'Troms',
    'Finnmark',
  ]

  const handleSearch = (value: string) => {
    logNavigationEvent('alternativprodukter', 'søk', 'Søk fra alternativprodukter')
    typeof window !== 'undefined' &&
      faro.api.pushEvent('alternativSearch', {
        searchTerm: value,
        warehouse: selectedWarehouse ?? '',
      })
    router.push(`${pathname}?hms=${value}`)
  }

  useEffect(() => {
    setSelectedWarehouse(localStorage.getItem(localStorageWarehouseKey) ?? undefined)
  }, [])

  const changeSelectedWarehouse = (value: string) => {
    const name = warehouseNames.find((it) => it === value) ?? ''
    setSelectedWarehouse(name)
    if (typeof window !== 'undefined') {
      localStorage.setItem(localStorageWarehouseKey, name)
      faro.api.pushEvent('selectedWarehouse', {
        warehouse: name,
      })
    }
  }

  if (
    typeof window !== 'undefined' &&
    !(
      window.location.href.startsWith('https://finnhjelpemiddel.ansatt') ||
      window.location.href.startsWith('http://localhost')
    )
  ) {
    return <div>ikke tilgang</div>
  }

  return (
    <VStack gap={'4'} className={`${styles.container} main-wrapper--large`}>
      <Bleed marginInline="full" reflectivePadding style={{ backgroundColor: '#F5F9FF' }}>
        <VStack paddingBlock={'12'}>
          <Heading level="1" size="large" spacing>
            Alternativer på lager
          </Heading>

          <Box paddingBlock={'0 8'}>
            <BodyShort spacing>
              Lagerstatusen oppdateres hver natt fra OeBS, og er regnet ut fra tilgjengelig minus behovsmeldt.
            </BodyShort>
            <BodyShort>Hjelpemiddelområder som ikke finnes her er:</BodyShort>
            <ul style={{ marginTop: '0' }}>
              <li>Sitteputer med trykksårforebyggende egenskaper</li>
              <li>Omgivelseskontroll</li>
              <li>Elektrisk hev- og senkfunksjon til innredning på kjøkken og bad</li>
            </ul>
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

            <Select
              label={'Velg sentral'}
              hideLabel
              className={styles.selectWarehouse}
              onChange={(e) => changeSelectedWarehouse(e.target.value)}
              value={selectedWarehouse ?? ''}
            >
              <option key={0} value={''}>
                Velg sentral
              </option>
              {warehouseNames &&
                warehouseNames.map((name, i) => (
                  <option key={i + 1} value={name}>
                    {name}
                  </option>
                ))}
            </Select>
          </HStack>
        </VStack>
      </Bleed>

      {searchParams.has('hms') && (
        <AlternativeProductList hmsNumber={searchParams.get('hms')!} selectedWarehouse={selectedWarehouse} />
      )}
    </VStack>
  )
}
