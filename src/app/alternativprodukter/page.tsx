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

export interface AlternativeProductData {
  product: Product
  stocks: WarehouseStock[]
  currentWarehouseStock: WarehouseStock | undefined
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

const AlternativeProductList = ({
  hmsNumber,
  currentWarehouse,
}: {
  hmsNumber: string
  currentWarehouse?: string | undefined
}) => {
  const { data: alternativeResponse } = useSWRImmutable<AlternativeProductResponse>(`/alternativ/${hmsNumber}`, () =>
    getAlternativeProductsInventory(hmsNumber)
  )
  const alternatives = alternativeResponse?.alternatives
  const hmsArtNrs = alternatives?.map((alternative) => alternative.hmsArtNr) ?? []

  const { data: products, isLoading } = useSWR<Product[]>(
    alternativeResponse ? `alternatives-${hmsNumber}` : null,
    () => getProductFromHmsArtNr(hmsArtNrs)
  )

  const { data: originalProductResponse, isLoading: isLoadingOriginal } = useSWR<Product[]>(
    alternativeResponse ? hmsNumber : null,
    () => getProductFromHmsArtNr([hmsNumber])
  )

  if (isLoading || isLoadingOriginal || !products || !originalProductResponse) {
    return <Loader />
  }

  if (!alternatives || alternatives.length == 0) {
    return <>{hmsNumber} har ingen kjente alternativer for gjenbruk</>
  }

  const mergeData = (product: Product, stocks: WarehouseStock[]): AlternativeProductData => {
    return {
      product: product,
      stocks: stocks,
      currentWarehouseStock: currentWarehouse
        ? stocks.find((stockLocation) => stockLocation.organisasjons_navn.includes(currentWarehouse))
        : undefined,
    }
  }

  const originalProduct = mergeData(originalProductResponse[0], alternativeResponse.original.warehouseStock)

  const alternativeProducts: AlternativeProductData[] = products.map((product) => {
    const stocks = alternatives.find((alt) => alt.hmsArtNr === product.variants[0].hmsArtNr)?.warehouseStock!
    return mergeData(product, stocks)
  })

  alternativeProducts.sort((a, b) => {
    if (a.product.variants[0].agreements.length === 0 && b.product.variants[0].agreements.length === 0) {
      return (
        (b.currentWarehouseStock ? getNumberInStock(b.currentWarehouseStock) : 0) -
        (a.currentWarehouseStock ? getNumberInStock(a.currentWarehouseStock) : 0)
      )
    }
    if (a.product.variants[0].agreements.length === 0) {
      return 1
    }
    if (b.product.variants[0].agreements.length === 0) {
      return -1
    }
    return (
      a.product.variants[0].agreements[0].rank - b.product.variants[0].agreements[0].rank ||
      (b.currentWarehouseStock ? getNumberInStock(b.currentWarehouseStock) : 0) -
        (a.currentWarehouseStock ? getNumberInStock(a.currentWarehouseStock) : 0)
    )
  })

  return (
    <>
      <div>
        <Heading size="medium" spacing>
          Treff på HMS {hmsNumber}:<HGrid gap={'4'} columns={{ sm: 1, md: 1 }}></HGrid>
        </Heading>
        <AlternativeProduct alternativeProductData={originalProduct} currentWarehouse={currentWarehouse} />
      </div>
      <div>
        <Heading size="medium" spacing>
          Alternative produkter
        </Heading>
        <HGrid gap={'4'} columns={{ sm: 1, md: 1 }}>
          {alternativeProducts.map((alternative) => {
            return (
              <AlternativeProduct
                alternativeProductData={alternative}
                currentWarehouse={currentWarehouse}
                key={alternative.product.variants[0]!.id}
              />
            )
          })}
        </HGrid>
      </div>
    </>
  )
}

const getNumberInStock = (warehouseStock: WarehouseStock) => {
  return Math.max(warehouseStock.tilgjengelig - warehouseStock.behovsmeldt, 0)
}

const AlternativeProduct = ({
  alternativeProductData,
  currentWarehouse,
}: {
  alternativeProductData: AlternativeProductData
  currentWarehouse?: string | undefined
}) => {
  const [openWarehouseStock, setOpenWarehouseStock] = useState(false)
  const product = alternativeProductData.product
  const stocks = alternativeProductData.stocks
  const variant = alternativeProductData.product.variants[0]
  const currentWarehouseStock = alternativeProductData.currentWarehouseStock
  const numberInStock = currentWarehouseStock ? getNumberInStock(currentWarehouseStock) : undefined

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
          {currentWarehouse && (
            <>
              <b>{currentWarehouse}:</b>
              {numberInStock !== undefined && <StockTag amount={numberInStock} />}
            </>
          )}
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
      <Label>Lagerstatus</Label>
      <HGrid gap="2" columns={2} className={styles.locationInfoContainer}>
        {stocks?.map((stock) => (
          <li key={stock.organisasjons_id}>
            <LocationInfo stock={stock} />
          </li>
        ))}
      </HGrid>
    </Box>
  )
}

const LocationInfo = ({ stock }: { stock: WarehouseStock }) => {
  const amount = stock ? Math.max(stock.tilgjengelig - stock.behovsmeldt, 0) : undefined
  const warehouseName = stock.organisasjons_navn.substring(4)
  return (
    <HStack className={styles.locationInfo} gap={'2'}>
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
