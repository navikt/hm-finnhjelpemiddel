'use client'

import { Heading } from '@/components/aksel-client'
import styles from './AlternativeProducts.module.scss'
import {
  BodyShort,
  Box,
  Button,
  HGrid,
  HStack,
  Label,
  Link,
  Loader,
  Search,
  Select,
  Tag,
  VStack,
} from '@navikt/ds-react'
import { ChevronDownIcon, XMarkIcon } from '@navikt/aksel-icons'
import { getAlternativeProductsInventory, getProductFromHmsArtNr } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import useSWR from 'swr'
import NextLink from 'next/link'
import useSWRImmutable from 'swr/immutable'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import ProductImage from '@/components/ProductImage'
import { AlternativeProductList } from '@/app/alternativprodukter/AlternativeProductsList'

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

export interface AlternativeProductResponse {
  original: ProductStock
  alternatives: ProductStock[]
}

export interface AlternativeProduct {
  product: Product
  stocks: WarehouseStock[]
  currentWarehouseStock: WarehouseStock | undefined
  isInStock: boolean
}

export default function AlternativeProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [currentWarehouse, setCurrentWarehouse] = useState<string | undefined>()

  const warehouseNames = [
    'Østfold',
    'Oslo',
    'Hedmark',
    'Oppland',
    'Buskerud',
    'Vestfold',
    'Telemark',
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
    router.replace(`${pathname}?hms=${value}`, {
      scroll: false,
    })
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
    <div className={`${styles.container} main-wrapper--large`}>
      <Heading level="1" size="large" className={styles.headerColor}>
        Finn gjenbruksprodukt
      </Heading>
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
          onChange={(e) => setCurrentWarehouse(warehouseNames.find((it) => it === e.target.value))}
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
        <AlternativeProductList hmsNumber={searchParams.get('hms')!} currentWarehouse={currentWarehouse} />
      )}
    </div>
  )
}
