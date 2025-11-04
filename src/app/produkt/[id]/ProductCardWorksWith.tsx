'use client'

import { Product, ProductVariant } from '@/utils/product-util'
import { BodyShort, Box, CopyButton, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import { logActionEvent, logNavigationEvent } from '@/utils/amplitude'
import styles from './ProductCardWorksWith.module.scss'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import { ThumbUpIcon } from '@navikt/aksel-icons'

export const ProductCardWorksWith = ({
  product,
  rank,
  variantCount,
}: {
  product: Product
  rank?: number
  variantCount?: number
}) => {
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))

  const searchParams = useSearchParams()
  const linkToProduct = `/produkt/${product.id}`
/*  const linkToSeries = `/produkt/${product.}`*/

  const currentRank = rank ? rank : minRank
  const onAgreement = currentRank !== Infinity
  const hmsArtNr = product.variants[0].hmsArtNr

  return (
    <Box padding={{ xs: '2', md: '3' }} className={styles.container} width={{ xs: '100%', sm: '450px' }}>
      {/*    <HStack gap="3" align="start" wrap={false}>
       <Box className={styles.imageWrapper}>
          <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
        </Box>*/}
        <VStack gap={{ xs: '1', md: '2' }}>
         {/* {onAgreement ? (
            <SuccessTag className={styles.agreementTag}>
              {currentRank === 99 ? 'På avtale' : `Rangering ${currentRank}`}
            </SuccessTag>
          ) : (
            <NeutralTag>Ikke på avtale</NeutralTag>
          )}*/}
          {/*<Box className={styles.productSummary}>
            <Link
              className={styles.link}
              href={linkToProduct}
              aria-label={`Gå til ${product.articleName}`}
              as={NextLink}
              onClick={() => logNavigationEvent('Produktkort_worksWith', 'produkt', product.articleName)}
            >
              <BodyShort weight="semibold">{product.articleName}</BodyShort>
            </Link>
            { product.hmsArtNr && (
              <CopyButton
                size="medium"
                className={styles.copyButton}
                copyText={product.hmsArtNr || ''}
                text={product.hmsArtNr || ''}
                activeText="kopiert"
                variant="action"
                activeIcon={<ThumbUpIcon aria-hidden />}
                iconPosition="right"
                onClick={() => logActionEvent('kopier')}
              />
              )}
          </Box>*/}
{/*          <Box padding={{ xs: '2', md: '3' }} className={styles.container} width={{ xs: '100%', sm: '380px' }}>*/}
            <HStack gap="3" align="start" wrap={false}>
              <Box className={styles.imageWrapper}>
                <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
              </Box>
              <VStack gap={{ xs: '1', md: '2' }}>
                <Box className={styles.productSummary}>
                  <Link
                    className={styles.link}
                    href={linkToProduct}
                    aria-label={`Gå til ${product.title}`}
                    as={NextLink}
                    onClick={() => logNavigationEvent('Produktkort_worksWith', 'produkt', product.title)}
                  >
                    <BodyShort weight="semibold">{product.title.length > 50 ? product.title.slice(0, 35) + '...' : product.title}</BodyShort>
                  </Link>
                </Box>
                  <Box className={styles.productSummary}>
                  { hmsArtNr && (
                    <CopyButton
                      size="medium"
                      className={styles.copyButton}
                      copyText={hmsArtNr || ''}
                      text={hmsArtNr || ''}
                      activeText="kopiert"
                      variant="action"
                      activeIcon={<ThumbUpIcon aria-hidden />}
                      iconPosition="right"
                      onClick={() => logActionEvent('kopier')}
                    />
                  )}
                </Box>
              </VStack>
            </HStack>
{/*          </Box>*/}
        </VStack>
{/*      </HStack>*/}
    </Box>
  )
}
