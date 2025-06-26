'use client'

import { Heading } from '@/components/aksel-client'
import styles from './AlternativeProducts.module.scss'
import { BodyShort, HStack, Search, Select, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AlternativeProductList } from '@/app/gjenbruksprodukter/AlternativeProductsList'
import { logNavigationEvent } from '@/utils/amplitude'
import { faro } from '@grafana/faro-core'

export interface WarehouseStock {
  erPåLager: boolean
  organisasjons_id: number
  organisasjons_navn: string
  artikkelnummer: string
  artikkelid: number
  fysisk: number
  tilgjengeligatt: number
  tilgjengeligroo: number
  tilgjengelig: number
  behovsmeldt: number
  reservert: number
  restordre: number
  bestillinger: number
  anmodning: number
  intanmodning: number
  forsyning: number
  sortiment: boolean
  lagervare: boolean
  minmax: boolean
}

export interface ProductStock {
  hmsArtNr: string
  warehouseStock: WarehouseStock[]
}

export interface AlternativeStockResponse {
  original: ProductStock
  alternatives: ProductStock[]
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
    router.replace(`${pathname}?hms=${value}`, {
      scroll: false,
    })
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
      <Heading level="1" size="large" className={styles.headerColor}>
        Finn gjenbruksprodukt
      </Heading>

      <div>
        <BodyShort spacing>
          Lagerstatusen oppdateres hver natt fra OeBS, og er regnet ut fra tilgjengelig minus behovsmeldt.
        </BodyShort>
        <BodyShort>Hjelpemiddelområder som ikke finnes i Finn gjenbruksprodukt er:</BodyShort>
        <ul style={{ marginTop: '0' }}>
          <li>Sitteputer med trykksårforebyggende egenskaper</li>
          <li>Omgivelseskontroll</li>
          <li>Elektrisk hev- og senkfunksjon til innredning på kjøkken og bad</li>
        </ul>
      </div>

      <HStack gap={'7'} align={'end'}>
        <Search
          label={'HMS-nummer'}
          hideLabel={false}
          variant="secondary"
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

      {searchParams.has('hms') && (
        <AlternativeProductList hmsNumber={searchParams.get('hms')!} selectedWarehouse={selectedWarehouse} />
      )}
    </VStack>
  )
}
