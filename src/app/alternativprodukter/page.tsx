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
import { ChevronDownIcon, LocationPinIcon, XMarkIcon } from '@navikt/aksel-icons'
import { getAlternativeProductsInventory, getProductFromHmsArtNr } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import useSWR from 'swr'
import NextLink from 'next/link'
import useSWRImmutable from 'swr/immutable'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useRef, useState } from 'react'
import ProductImage from '@/components/ProductImage'
import { log } from 'next/dist/server/typescript/utils'

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

export default function AlternativeProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [currentWarehouse, setCurrentWarehouse] = useState<{ key: string; value: string } | undefined>(undefined)

  const warehouseNames = [
    {
      key: 'Østfold',
      value: '*01 Østfold',
    },
    {
      key: 'Oslo',
      value: '*03 Oslo',
    },
    {
      key: 'Hedmark',
      value: '*04 Hedmark',
    },
    {
      key: 'Oppland',
      value: '*05 Oppland',
    },
    {
      key: 'Buskerud',
      value: '*06 Buskerud',
    },
    {
      key: 'Vestfold',
      value: '*07 Vestfold',
    },
    {
      key: 'Telemark',
      value: '*08 Telemark',
    },
    {
      key: 'Aust-Agder',
      value: '*09 Aust-Agder',
    },
    {
      key: 'Vest-Agder',
      value: '*10 Vest-Agder',
    },
    {
      key: 'Rogaland',
      value: '*11 Rogaland',
    },
    {
      key: 'Hordaland',
      value: '*12 Hordaland',
    },
    {
      key: 'Sogn og Fjordane',
      value: '*14 Sogn og Fjordane',
    },
    {
      key: 'Møre og Romsdal',
      value: '*15 Møre og Romsdal',
    },
    {
      key: 'Sør-Trøndelag',
      value: '*16 Sør-Trøndelag',
    },
    {
      key: 'Nord-Trøndelag',
      value: '*17 Nord-Trøndelag',
    },
    {
      key: 'Nordland',
      value: '*18 Nordland',
    },
    {
      key: 'Troms',
      value: '*19 Troms',
    },
    {
      key: 'Finnmark',
      value: '*20 Finnmark',
    },
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
    <div className={`${styles.container} main-wrapper--medium`}>
      <Heading level="1" size="large" className={styles.headerColor}>
        Finn gjenbruksprodukt
      </Heading>
      <Label>{currentWarehouse ? `Valgt sentral: ${currentWarehouse.key}` : 'Alle sentraler'}</Label>

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
        onChange={(e) => setCurrentWarehouse(warehouseNames.find((it) => it.value === e.target.value))}
      >
        <option key={0} value={''}>
          Velg sentral
        </option>
        {warehouseNames &&
          warehouseNames.map((name, i) => (
            <option key={i + 1} value={name.value}>
              {name.key}
            </option>
          ))}
      </Select>

      {searchParams.has('hms') && <AlternativeProductList hmsNumber={searchParams.get('hms')!} />}
    </div>
  )
}

const AlternativeProductList = ({ hmsNumber }: { hmsNumber: string }) => {
  const { data: alternativeResponse } = useSWRImmutable<AlternativeProductResponse>(`/alternativ/${hmsNumber}`, () =>
    getAlternativeProductsInventory(hmsNumber)
  )
  const alternatives = alternativeResponse?.alternatives
  const hmsArtNrs = (alternatives?.map((alternative) => alternative.hmsArtNr) ?? []).concat([hmsNumber])

  const { data: products, isLoading } = useSWR<Product[]>(
    alternativeResponse ? `alternatives-${hmsNumber}` : null,
    () => getProductFromHmsArtNr(hmsArtNrs)
  )

  if (isLoading || !products) {
    return <Loader />
  }

  if (!alternatives || alternatives.length == 0) {
    return <>{hmsNumber} har ingen kjente alternativer for gjenbruk</>
  }

  products.sort((a, b) => {
    if (a.variants[0].agreements.length === 0 && b.variants[0].agreements.length === 0) {
      return 1
    }
    if (a.variants[0].agreements.length === 0) {
      return 0
    }
    if (b.variants[0].agreements.length === 0) {
      return -1
    }
    return b.variants[0].agreements[0].rank - a.variants[0].agreements[0].rank
  })

  return (
    <>
      <div>
        <Heading size="medium" spacing>
          Treff på HMS {hmsNumber}:<HGrid gap={'4'} columns={{ sm: 1, md: 1 }}></HGrid>
        </Heading>
        <AlternativeProduct
          product={products.find((product) => product.variants[0].hmsArtNr === hmsNumber)!}
          stocks={alternativeResponse.original.warehouseStock}
        />
      </div>
      <div>
        <Heading size="medium" spacing>
          Alternative produkter
        </Heading>
        <HGrid gap={'4'} columns={{ sm: 1, md: 1 }}>
          {products
            .filter((product) => product.variants[0].hmsArtNr !== hmsNumber)
            .map((product) => {
              const stocks = alternatives.find((alt) => alt.hmsArtNr === product.variants[0].hmsArtNr)?.warehouseStock
              return <AlternativeProduct product={product} stocks={stocks} key={product.id} />
            })}
        </HGrid>
      </div>
    </>
  )
}

const AlternativeProduct = ({ product, stocks }: { product: Product; stocks: WarehouseStock[] | undefined }) => {
  const [openWarehouseStock, setOpenWarehouseStock] = useState(false)
  const variant = product.variants[0]
  const osloStock = stocks?.find((stockLocation) => stockLocation.organisasjons_navn === '*03 Oslo')!
  const numberInStock = osloStock ? Math.max(osloStock.tilgjengelig - osloStock.behovsmeldt, 0) : undefined

  return (
    <HStack align={'start'} className={styles.alternativeProductContainer}>
      <VStack justify="space-between" padding={'5'} className={styles.productContainer}>
        <HStack justify="space-between">
          <VStack gap={'3'} className={styles.productProperties}>
            {variant.agreements.length === 0 ? (
              <Label size="small" className={styles.notInAgreementColor}>
                Ikke på avtale
              </Label>
            ) : (
              <Label size="small" className={styles.headerColor}>
                NAV - Rangering {variant.agreements[0].rank}
              </Label>
            )}
            <Link as={NextLink} href={`/produkt/${product.id}`} className={styles.link}>
              {product.title}
            </Link>
            {variant.status === 'INACTIVE' && (
              <Tag size="small" variant="neutral-moderate" className={styles.expiredTag}>
                Utgått
              </Tag>
            )}
            <BodyShort size="small">{product.supplierName}</BodyShort>
            <BodyShort size="small">HMS: {variant.hmsArtNr}</BodyShort>
          </VStack>
          <Box paddingInline="2" paddingBlock="2" className={styles.imageWrapper}>
            <ProductImage src={product.photos[0]?.uri} productTitle={'produktbilde'}></ProductImage>
          </Box>
        </HStack>
        <HStack align={'center'} justify={'space-between'} gap={'2'}>
          <>
            <b>Oslo:</b>
            {numberInStock !== undefined && <StockTag amount={numberInStock} />}
          </>
          <Button
            variant={'secondary'}
            size={'small'}
            icon={<ChevronDownIcon />}
            iconPosition={'right'}
            onClick={() => setOpenWarehouseStock(!openWarehouseStock)}
          >
            Se lagerstatus
          </Button>
        </HStack>
      </VStack>

      {openWarehouseStock && <WarehouseStatus stocks={stocks} />}

      {openWarehouseStock && (
        <Box padding={'2'}>
          <Button
            variant={'tertiary'}
            size={'small'}
            icon={<XMarkIcon />}
            onClick={() => setOpenWarehouseStock(false)}
            className={styles.closeButton}
          />
        </Box>
      )}
    </HStack>
  )
}

const WarehouseStatus = ({ stocks }: { stocks: WarehouseStock[] | undefined }) => {
  return (
    <Box className={styles.warehouseStatus}>
      <HStack justify={'space-between'} align={'start'} style={{ alignSelf: 'stretch' }}>
        <Label>Lagerstatus</Label>
      </HStack>
      <HGrid gap="2" columns={2} className={styles.centralInfoContainer}>
        {stocks?.map((stock) => (
          <li key={stock.organisasjons_id}>
            <CentralInfo stock={stock} />
          </li>
        ))}
      </HGrid>
    </Box>
  )
}

const CentralInfo = ({ stock }: { stock: WarehouseStock }) => {
  const amount = stock ? Math.max(stock.tilgjengelig - stock.behovsmeldt, 0) : undefined
  const warehouseName = stock.organisasjons_navn.substring(4)
  return (
    <HStack className={styles.centralInfo}>
      <Label>{warehouseName}</Label>
      {amount !== undefined && <StockTag amount={amount} />}
    </HStack>
  )
}

const StockTag = ({ amount }: { amount: number }) => {
  if (amount === 0) {
    return (
      <Tag variant="neutral" size={'small'}>
        Ingen på lager
      </Tag>
    )
  } else
    return (
      <Tag variant="success" size={'small'}>
        {amount} stk på lager
      </Tag>
    )
}
