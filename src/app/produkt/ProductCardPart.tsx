'use client'

import { Product } from '@/utils/product-util'
import { BodyShort, Box, HStack, Link, Tag, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import { logNavigationEvent } from '@/utils/amplitude'
import styles from './ProductCardPart.module.scss'
import { NeutralTag, SuccessTag } from '@/components/Tags'

export const ProductCardPart = ({
  product,
  rank,
  variantCount,
}: {
  product: Product
  rank?: number
  variantCount: number
}) => {
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))

  const searchParams = useSearchParams()
  const linkToProduct = `/produkt/${product.id}?${searchParams}`

  const currentRank = rank ? rank : minRank
  const onAgreement = currentRank !== Infinity

  return (
    <Box padding={{ xs: '2', md: '3' }} className={styles.container} width={{ xs: '100%', sm: '380px' }}>
      <HStack gap="3" align="start" wrap={false}>
        <Box className={styles.imageWrapper}>
          <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
        </Box>
        <VStack gap={{ xs: '1', md: '2' }}>
            {onAgreement ? (
              <SuccessTag>
                {currentRank === 99 ? 'På avtale' : `Rangering ${currentRank}`}
              </SuccessTag>
            ) : (
              <NeutralTag>
                Ikke på avtale
              </NeutralTag>
            )}
          <Box className={styles.productSummary}>
            <Link
              className={styles.link}
              href={linkToProduct}
              aria-label={`Gå til ${product.title}`}
              as={NextLink}
              onClick={() => logNavigationEvent('Produktkort_deler', 'produkt', product.title)}
            >
              <BodyShort weight="semibold">{product.title}</BodyShort>
            </Link>
            <BodyShort size="small">{`${variantCount} ${variantCount === 1 ? 'variant' : 'varianter'}`} </BodyShort>
            <BodyShort size="small">{product.supplierName}</BodyShort>
          </Box>
        </VStack>
      </HStack>
    </Box>
  )
}
