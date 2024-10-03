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

export default function AlternativeProductsPage() {
  const hmsNumber = '292483'

  const alternatives = ['242660', '242529', '147286', '149875']

  const { data: storage } = useSWRImmutable<any>(`/lager/alle-sentraler/${hmsNumber}`, fetcherGET)

  console.log(storage)

  const { data: alternativeProducts, isLoading } = useSWR<Product[]>('/product/_search', () =>
    getProductFromHmsArtNr(alternatives)
  )

  if (isLoading || !alternativeProducts) {
    return <></>
  }

  alternativeProducts.sort((a, b) => {
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
        {alternativeProducts.map((product) => (
          <AlternativeProduct product={product} key={product.id} />
        ))}
      </HGrid>
    </div>
  )
}

const AlternativeProduct = ({ product }: { product: Product }) => {
  const variant = product.variants[0]
  return (
    <HStack justify="space-between" padding={'5'} className={styles.productContainer}>
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
  )
}
