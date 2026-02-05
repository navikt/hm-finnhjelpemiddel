'use client'

import { Product } from '@/utils/product-util'
import { BodyShort, Box, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import styles from './ProductCardSearch.module.scss'
import { CompareButton } from '@/app/rammeavtale/hjelpemidler/[agreementId]/CompareButton'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import { productCardTitleMaxLength, truncateText } from '@/utils/string-util'

export const ProductCardSearch = ({
  product,
  rank,
  handleCompareClick,
}: {
  product: Product
  rank?: number
  variantCount: number
  handleCompareClick?: () => void
}) => {
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))

  const searchParams = useSearchParams()
  const linkToProduct = `/produkt/${product.id}?${searchParams}`

  const currentRank = rank ? rank : minRank
  const onAgreement = currentRank !== Infinity

  return (
    <Box padding={{ xs: 'space-8', md: 'space-16' }} className={styles.container} width={{ xs: '100%', sm: '288px' }}>
      <VStack justify={'space-between'} height={'100%'} gap={'space-8'}>
        <VStack>
          <HStack paddingBlock={{ xs: 'space-0', md: 'space-0 space-16' }} align={'center'} justify={'space-between'}>
            {onAgreement ? (
              <SuccessTag>{currentRank === 99 ? 'På avtale' : `Rangering ${currentRank}`}</SuccessTag>
            ) : (
              <NeutralTag>Ikke på avtale</NeutralTag>
            )}
            <CompareButton product={product} handleCompareClick={handleCompareClick} />
          </HStack>

          <Box className={styles.imageWrapper}>
            <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
          </Box>
          <Link className={styles.link} href={linkToProduct} aria-label={`Gå til ${product.title}`} as={NextLink}>
            <BodyShort weight="semibold">
              {' '}
              {product.title.length > productCardTitleMaxLength
                ? truncateText(product.title, productCardTitleMaxLength)
                : product.title}
            </BodyShort>
          </Link>
        </VStack>

        <VStack gap={{ xs: 'space-4', md: 'space-16' }}>
          <BodyShort size="small">{product.supplierName}</BodyShort>
        </VStack>
      </VStack>
    </Box>
  )
}
