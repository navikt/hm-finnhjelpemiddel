'use client'

import { Heading } from '@/components/aksel-client'
import styles from './AlternativeProducts.module.scss'
import { BodyShort, Box, HGrid, HStack, Label, Link, Search, Tag, VStack } from '@navikt/ds-react'
import { fetcherGET, getProductFromHmsArtNr } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import useSWR from 'swr'
import NextLink from 'next/link'
import { smallImageLoader } from '@/utils/image-util'
import Image from 'next/image'
import useSWRImmutable from 'swr/immutable'

interface WarehouseStock {
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

interface AlternativeProduct {
  hmsArtNr: string
  warehouseStock: WarehouseStock[]
}

const alts: AlternativeProduct[] = [
  {
    hmsArtNr: '242529',
    warehouseStock: [
      {
        erPåLager: true,
        organisasjons_id: 243,
        organisasjons_navn: '*03 Oslo',
        artikkelnummer: '242529',
        artikkelid: 4222043,
        fysisk: 6,
        tilgjengeligatt: 6,
        tilgjengeligroo: 0,
        tilgjengelig: 6,
        behovsmeldt: 0,
        reservert: 0,
        restordre: 0,
        bestillinger: 0,
        anmodning: 0,
        intanmodning: 0,
        forsyning: 0,
        sortiment: false,
        lagervare: false,
        minmax: false,
      },
    ],
  },
]

export default function AlternativeProductsPage() {
  const hmsNumber = '292483'

  //const alternatives = alts

  const { data: alternatives } = useSWRImmutable<AlternativeProduct[]>(
    `${process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL}/alternativ/${hmsNumber}`,
    fetcherGET
  )

  const { data: products, isLoading } = useSWR<Product[]>('/product/_search', () =>
    getProductFromHmsArtNr(alternatives!.map((alternative) => alternative.hmsArtNr))
  )

  if (isLoading || !products) {
    return <></>
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
    <div className={`${styles.container} main-wrapper--medium`}>
      <Heading level="1" size="large" className={styles.headerColor}>
        Finn gjenbruksprodukt
      </Heading>

      <Search label={'HMS-nummer'} hideLabel={false} variant="secondary" className={styles.search}></Search>

      <HGrid gap={'4'} columns={{ sm: 1, md: 1 }}>
        {products.map((product) => {
          const stocks = alts.find((alt) => alt.hmsArtNr === product.variants[0].hmsArtNr)!.warehouseStock
          return <AlternativeProduct product={product} stocks={stocks} key={product.id} />
        })}
      </HGrid>
    </div>
  )
}

const AlternativeProduct = ({ product, stocks }: { product: Product; stocks: WarehouseStock[] }) => {
  const variant = product.variants[0]

  const osloStock = stocks.find((stockLocation) => stockLocation.organisasjons_navn === '*03 Oslo')!

  const numberInStock = Math.max(osloStock.tilgjengelig - osloStock.behovsmeldt, 0)

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
        <StockTag amount={numberInStock} />
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
