import { Product } from '@/utils/product-util'
import { BodyShort, Box, HStack, VStack } from '@navikt/ds-react'
import styles from '@/app/gjenbruksprodukter/AddAlternativeCard.module.scss'
import ProductImage from '@/components/ProductImage'
import React from 'react'

export const AddAlternativeCard = ({ product }: { product: Product }) => {
  const variant = product.variants[0]

  return (
    <Box className={styles.alternativeProductContainer}>
      <VStack justify="space-between" padding={'5'} gap={'2'} className={styles.productContainer}>
        <HStack justify="space-between">
          <VStack gap={'1'} className={styles.productProperties}>
            <BodyShort size="small" weight="semibold">
              {variant.articleName}
            </BodyShort>
            <BodyShort size="small">{variant.supplierName}</BodyShort>
            <BodyShort size="small">HMS: {variant.hmsArtNr}</BodyShort>
          </VStack>
          <Box paddingInline="2" paddingBlock="2" className={styles.imageWrapper}>
            <ProductImage src={product.photos[0].uri} productTitle={'produktbilde'}></ProductImage>
          </Box>
        </HStack>
      </VStack>
    </Box>
  )
}
