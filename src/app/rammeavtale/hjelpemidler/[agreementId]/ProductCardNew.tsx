'use client'

import { Product } from '@/utils/product-util'
import { BodyShort, Box, HStack, Link, Tag, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import { logNavigationEvent } from '@/utils/amplitude'
import styles from './ProductCardNew.module.scss'
import { CompareButton } from '@/app/rammeavtale/hjelpemidler/[agreementId]/CompareButton'

export const ProductCardNew = ({
  product,
  rank,
  variantCount,
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
    <Box padding={{ xs: '2', md: '4' }} className={styles.container} width={{ xs: '100%', sm: '288px' }}>
      <VStack justify={'space-between'} height={'100%'} gap={'2'}>
        <VStack>
          <HStack paddingBlock={{ xs: '0', md: '0 4' }} align={'start'} justify={'space-between'}>
            {onAgreement ? (
              <Tag variant={'success-moderate'} className={styles.agreementTag}>
                {`Rangering ${currentRank}`}
              </Tag>
            ) : (
              <Tag variant={'neutral-moderate'} className={styles.nonAgreementTag}>
                Ikke på avtale
              </Tag>
            )}
            <CompareButton product={product} handleCompareClick={handleCompareClick} />
          </HStack>

          <Box className={styles.imageWrapper}>
            <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
          </Box>
          <Link
            className={styles.link}
            href={linkToProduct}
            aria-label={`Gå til ${product.title}`}
            as={NextLink}
            onClick={() => logNavigationEvent('Produktkort', 'produkt', product.title)}
          >
            <BodyShort weight="semibold">{product.title}</BodyShort>
          </Link>
        </VStack>

        <VStack gap={{ xs: '1', md: '4' }}>
          <BodyShort size="small">{product.supplierName}</BodyShort>
          <BodyShort size="small">{`${variantCount} ${variantCount === 1 ? 'variant' : 'varianter'}`} </BodyShort>
        </VStack>
      </VStack>
    </Box>
  )
}
