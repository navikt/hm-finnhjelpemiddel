import { Product } from '@/utils/product-util'
import { BodyShort, Box, HStack, VStack } from '@navikt/ds-react'
import styles from '@/app/gjenbruksprodukter/AddAlternativeCard.module.scss'
import ProductImage from '@/components/ProductImage'
import React from 'react'

export const AddAlternativeCard = ({ product }: { product: Product }) => {
  const variant = product.variants[0]

  return (
    <Box className={styles.alternativeProductContainer}>
      <HStack justify="space-between" align={'center'} wrap={false} className={styles.productContainer}>
        <VStack gap={'1'} className={styles.productProperties}>
          <BodyShort size="small" weight="semibold">
            {variant.articleName}
          </BodyShort>
          <BodyShort size="small">{variant.supplierName}</BodyShort>
          <BodyShort size="small">HMS: {variant.hmsArtNr}</BodyShort>
        </VStack>
        <Box className={styles.imageWrapper}>
          <ProductImage src={product.photos[0]?.uri} productTitle={'produktbilde'}></ProductImage>
        </Box>
      </HStack>
    </Box>
  )
}
