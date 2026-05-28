'use client'

import { Product } from '@/utils/product-util'
import { BodyShort, Box, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import { CompareButton } from '@/app/rammeavtale/hjelpemidler/[agreementId]/CompareButton'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import styles from './ProductCardCategory.module.scss'

export const ProductCardCategory = ({
  product,
  postTitle,
  handleCompareClick,
}: {
  product: Product
  postTitle: string
  handleCompareClick?: () => void
}) => {
  const linkToProduct = `/produkt/${product.id}`

  const rank = product.agreements && product.agreements.find((agreement) => agreement.postTitle === postTitle)?.rank
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
            <CompareButton product={product} handleCompareClick={handleCompareClick} />
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
            <BodyShort size="small">{product.supplierName}</BodyShort>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  )
}
