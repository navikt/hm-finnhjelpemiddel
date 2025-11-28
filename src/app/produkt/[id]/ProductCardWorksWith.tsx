'use client'

import { Product } from '@/utils/product-util'
import { BodyShort, Box, CopyButton, HStack, Link, Stack, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import { logActionEvent, logNavigationEvent } from '@/utils/amplitude'
import styles from './ProductCardWorksWith.module.scss'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { logUmamiClickButton, logUmamiNavigationEvent } from '@/utils/umami'

export const ProductCardWorksWith = ({ product }: { product: Product }) => {
  const linkToProduct = `/produkt/${product.id}`
  const hmsArtNr = product.variants[0].hmsArtNr

  return (
    <Box padding={{ xs: '2', md: '3' }} className={styles.container} width={{ xs: '100%', sm: '500px' }}>
      <VStack gap={{ xs: '1', md: '2' }}>
        {/*          <Box padding={{ xs: '2', md: '3' }} className={styles.container} width={{ xs: '100%', sm: '380px' }}>*/}
        <HStack gap="3" align="start" wrap={false}>
          <Box className={styles.imageWrapper}>
            <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
          </Box>
          <VStack gap={{ xs: '1', md: '2' }}  className={styles.textColumn}>
            <Box className={styles.productSummary}>
              <Link
                className={styles.link}
                href={linkToProduct}
                aria-label={`Gå til ${product.title}`}
                as={NextLink}
                onClick={() => {
                  logNavigationEvent('produktkort_worksWith', 'produkt', product.title)
                  logUmamiNavigationEvent('product_worksWith', linkToProduct, product.title)
                }}
              >
                <BodyShort weight="semibold">
                  {product.title.length > 40 ? product.title.slice(0, 40) + '...' : product.title}
                </BodyShort>
              </Link>
            </Box>
            <Box className={styles.productSummary}>
              {product.variants.length===1 ? (
                <CopyButton
                  size="small"
                  className={styles.copyButton}
                  copyText={hmsArtNr || ''}
                  text={hmsArtNr || ''}
                  activeText="kopiert"
                  variant="action"
                  activeIcon={<ThumbUpIcon aria-hidden />}
                  iconPosition="right"
                  onClick={() => {
                    logActionEvent('kopier')
                    logUmamiClickButton('kopiert', 'product-worksWith-copyButton', 'action')
                  }}
                />
              ): `${product.variants.length} varianter` }
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  )
}
