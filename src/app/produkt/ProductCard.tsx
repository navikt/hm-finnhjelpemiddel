'use client'

import { CompareButton } from '@/app/produkt/CompareButton'

import NextLink from 'next/link'

import { BodyShort, Box, HStack, Link, VStack } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'

import ProductImage from '@/components/ProductImage'
import { NeutralTag, SuccessTag } from '@/components/Tags'

import styles from './ProductCard.module.scss'

export const ProductCard = ({
  product,
  rank,
  variantCount,
}: {
  product: Product
  rank?: number
  variantCount?: number
}) => {
  const linkToProduct = `/produkt/${product.id}`
  const onAgreement = rank !== undefined

  return (
    <Box padding={{ xs: 'space-8', md: 'space-16' }} className={styles.container} width={{ xs: '100%', sm: '288px' }}>
      <VStack height={'100%'} gap={'space-8'}>
        <VStack>
          <HStack paddingBlock={{ xs: 'space-0', md: 'space-0 space-16' }} align={'center'} justify={'space-between'}>
            {onAgreement ? (
              <SuccessTag>{rank === 99 ? 'På avtale' : `Rangering ${rank}`}</SuccessTag>
            ) : (
              <NeutralTag>Ikke på avtale</NeutralTag>
            )}
            <CompareButton product={product} />
          </HStack>

          <Box className={styles.imageWrapper}>
            <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
          </Box>
          <BodyShort size="small" className={styles.isoCategoryText}>
            {product.isoCategoryTitle}
          </BodyShort>
          <VStack gap={'space-4'} paddingBlock={'space-8'}>
            <Link className={styles.link} href={linkToProduct} aria-label={`Gå til ${product.title}`} as={NextLink}>
              <BodyShort weight="semibold">{product.title}</BodyShort>
            </Link>
            <VStack gap={{ xs: 'space-4', md: 'space-16' }}>
              <BodyShort size="small">{product.supplierName}</BodyShort>
              {variantCount && (
                <BodyShort size="small">{`${variantCount} ${variantCount === 1 ? 'variant' : 'varianter'}`} </BodyShort>
              )}
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  )
}
