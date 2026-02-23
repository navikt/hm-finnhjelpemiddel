'use client'

import { Product } from '@/utils/product-util'
import { BodyShort, Box, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import { CompareButton } from '@/app/rammeavtale/hjelpemidler/[agreementId]/CompareButton'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import styles from './ProductCardKategori.module.scss'

export const ProductCardKategori = ({
  product,
  handleCompareClick,
}: {
  product: Product
  handleCompareClick?: () => void
}) => {
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))

  const minRankAgreement =
    product.agreements.length > 0 ? product.agreements.sort((a, b) => a.rank - b.rank)[0] : undefined

  const searchParams = useSearchParams()
  const linkToProduct = `/produkt/${product.id}`

  const onAgreement = minRank !== Infinity

  return (
    <Box padding={{ xs: 'space-8', md: 'space-16' }} className={styles.container} width={{ xs: '100%', sm: '288px' }}>
      <VStack height={'100%'} gap={'space-8'}>
        <VStack>
          <HStack paddingBlock={{ xs: 'space-0', md: 'space-0 space-16' }} align={'center'} justify={'space-between'}>
            {onAgreement ? <SuccessTag>På avtale</SuccessTag> : <NeutralTag>Ikke på avtale</NeutralTag>}
            <CompareButton product={product} handleCompareClick={handleCompareClick} />
          </HStack>

          <Box className={styles.imageWrapper}>
            <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
          </Box>
          <VStack gap={'space-4'} paddingBlock={'space-0 space-8'}>
            <Link className={styles.link} href={linkToProduct} aria-label={`Gå til ${product.title}`} as={NextLink}>
              <BodyShort weight="semibold">{product.title}</BodyShort>
            </Link>
            <BodyShort size="small">{product.supplierName}</BodyShort>
          </VStack>
          <BodyShort size="small" weight={'semibold'}>
            {product.isoCategoryTitle}
          </BodyShort>
        </VStack>

        <VStack gap={{ xs: 'space-4', md: 'space-16' }}>
          {minRankAgreement && (
            <HStack gap={'space-8'} wrap={false} align={'start'}>
              <SuccessTag>R{minRankAgreement.rank}</SuccessTag>
              <BodyShort size="small">{minRankAgreement.postTitle}</BodyShort>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Box>
  )
}
