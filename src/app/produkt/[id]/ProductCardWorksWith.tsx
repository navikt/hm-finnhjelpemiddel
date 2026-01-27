'use client'

import { Product } from '@/utils/product-util'
import { BodyShort, Box, CopyButton, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import ProductImage from '@/components/ProductImage'
import styles from './ProductCardWorksWith.module.scss'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { logUmamiClickButton, logUmamiNavigationEvent } from '@/utils/umami'

export const ProductCardWorksWith = ({ product }: { product: Product }) => {
  const hmsArtNr = product.variants[0].hmsArtNr
  const linkToProduct = `/produkt/${product.id}?term=${hmsArtNr || ''}`

  return (
    <Box className={styles.container} width={{ xs: '100%', sm: '500px' }}>
      <HStack gap="space-12" align="start" wrap={false}>
        <Box className={styles.imageWrapper}>
          <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
        </Box>
        <VStack gap={{ xs: "space-4", md: "space-8" }} className={styles.textColumn}>
          <Box className={styles.productSummary}>
            <Link
              className={styles.link}
              href={linkToProduct}
              aria-label={`Gå til ${product.title}`}
              as={NextLink}
              onClick={() => {
                logUmamiNavigationEvent('product_worksWith', linkToProduct, product.title)
              }}
            >
              <BodyShort weight="semibold">
                {product.title.length > 40 ? product.title.slice(0, 40) + '...' : product.title}
              </BodyShort>
            </Link>
          </Box>
          <Box className={styles.productSummary}>
            {product.variants.length === 1 ? (
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
                  logUmamiClickButton('kopiert', 'product-worksWith-copyButton', 'action')
                }}
              />
            ) : (
              `${product.variants.length} varianter`
            )}
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}
