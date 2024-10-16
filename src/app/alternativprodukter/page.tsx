'use client'

import { Heading } from '@/components/aksel-client'
import styles from './AlternativeProducts.module.scss'
import { BodyShort, Box, HGrid, HStack, Label, Link, Loader, Search, Tag, VStack } from '@navikt/ds-react'
import { getAlternativeProductsInventory, getProductFromHmsArtNr } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import useSWR from 'swr'
import NextLink from 'next/link'
import { smallImageLoader } from '@/utils/image-util'
import Image from 'next/image'
import useSWRImmutable from 'swr/immutable'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

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
  const variant = product.variants[0]

  const osloStock = stocks?.find((stockLocation) => stockLocation.organisasjons_navn === '*03 Oslo')!

  const numberInStock = osloStock ? Math.max(osloStock.tilgjengelig - osloStock.behovsmeldt, 0) : undefined

  return (
    <VStack justify="space-between" padding={'5'} className={styles.productContainer}>
      <HStack justify="space-between">
        <VStack gap={'3'}>
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
          <Image
            loader={smallImageLoader}
            src={product.photos[0].uri}
            alt={`Produktbilde`}
            fill
            style={{ objectFit: 'contain' }}
          />
        </Box>
      </HStack>
      <HStack align={'center'} gap={'2'}>
        <b>Oslo:</b>
        {numberInStock !== undefined && <StockTag amount={numberInStock} />}
      </HStack>
    </VStack>
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
