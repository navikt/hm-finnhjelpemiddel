import { BodyShort, Box, HStack, VStack } from '@navikt/ds-react'
import styles from '@/app/gjenbruksprodukter/AddAlternativeCard.module.scss'
import ProductImage from '@/components/ProductImage'
import React from 'react'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'

export const AddAlternativeCard = ({ product }: { product: AlternativeProduct }) => (
  <Box className={styles.alternativeProductContainer}>
    <HStack justify="space-between" align={'center'} wrap={false} className={styles.productContainer}>
      <VStack gap={'1'} className={styles.productProperties}>
        <BodyShort size="small" weight="semibold">
          {product.variantTitle}
        </BodyShort>
        <BodyShort size="small">{product.supplierName}</BodyShort>
        <BodyShort size="small">HMS: {product.hmsArtNr}</BodyShort>
      </VStack>
      <Box className={styles.imageWrapper}>
        <ProductImage src={product.imageUri} productTitle={'produktbilde'}></ProductImage>
      </Box>
    </HStack>
  </Box>
)
