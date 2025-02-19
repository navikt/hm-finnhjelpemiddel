'use client'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { ArrowsSquarepathIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, CopyButton, HGrid, Link, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import { logActionEvent, logNavigationEvent } from '@/utils/amplitude'
import styles from './ProductCardNew.module.scss'

export const ProductCardNew = ({
  product,
  linkOverwrite,
  rank,
  hmsNumbers,
  variantCount,
  handleCompareClick,
}: {
  product: Product
  linkOverwrite?: string
  rank?: number
  hmsNumbers?: string[]
  variantCount?: number
  handleCompareClick?: () => void
}) => {
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))

  const searchParams = useSearchParams()
  const linkToProduct = linkOverwrite || `/produkt/${product.id}?${searchParams}`

  const currentRank = rank ? rank : minRank
  const onAgreement = currentRank !== Infinity

  return (
    <Box padding={{ xs: '3', md: '5' }} className="product-card--new">
      <HGrid columns={'minmax(0,5fr) minmax(0,3fr)'} gap="5" maxWidth={'370px'} width={'100%'}>
        <VStack justify="space-between">
          <VStack gap="3" width={'100%'}>
            <BodyShort
              size="small"
              weight="semibold"
              className={
                onAgreement ? 'product-card__nav-on-agreement-text' : 'product-card__nav-not-on-agreement-text'
              }
            >
              {onAgreement
                ? currentRank < 90
                  ? `Nav - Rangering ${currentRank}`
                  : 'Nav - På avtale'
                : 'Ikke på avtale'}
            </BodyShort>

            <Link
              className="product-card__link-2"
              href={linkToProduct}
              aria-label={`Gå til ${product.title}`}
              as={NextLink}
              onClick={() => logNavigationEvent('Produktkort', 'produkt', product.title)}
            >
              <BodyShort weight="semibold" className="product-card__title">
                {product.title}
              </BodyShort>
            </Link>

            <BodyShort size="small">{product.supplierName}</BodyShort>

            {((variantCount && hmsNumbers && hmsNumbers?.length > 1) || (variantCount && !hmsNumbers)) && (
              <BodyShort size="small">{`${variantCount} ${variantCount > 1 ? 'varianter' : 'variant'}`} </BodyShort>
            )}
          </VStack>
          {hmsNumbers && hmsNumbers?.length === 1 && (
            <VStack align={'start'} gap="1">
              <BodyShort size="small" weight="semibold">
                HMS-nummer
              </BodyShort>
              <CopyButton
                size="small"
                className={styles.hmsCopyButton}
                copyText={hmsNumbers[0]}
                text={hmsNumbers[0]}
                activeText="HMS-nummer er kopiert"
                variant="action"
                activeIcon={<ThumbUpIcon aria-hidden />}
                iconPosition="right"
                onClick={() => logActionEvent('kopier')}
              />
            </VStack>
          )}
        </VStack>

        <VStack align="center" justify="space-between" gap="2" width={'100%'}>
          <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
          <CompareButton product={product} handleCompareClick={handleCompareClick} />
        </VStack>
      </HGrid>
    </Box>
  )
}

const CompareButton = ({
  product,
  handleCompareClick,
}: {
  product: Product
  handleCompareClick: (() => void) | undefined
}) => {
  const { setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()

  const toggleCompareProduct = () => {
    handleCompareClick && handleCompareClick()
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product.id)
      : setProductToCompare(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  return (
    <Button
      className={classNames('product-card__compare-button', {
        'product-card__compare-button--checked': isInProductsToCompare,
      })}
      size="small"
      variant="secondary"
      value="Legg produktet til sammenligning"
      onClick={toggleCompareProduct}
      // checked={isInProductsToCompare}
      icon={<ArrowsSquarepathIcon aria-hidden />}
      iconPosition="left"
      aria-pressed={isInProductsToCompare}
    >
      <div aria-label={`sammenlign ${product.title}`}>
        <span aria-hidden>Sammenlign</span>
      </div>
    </Button>
  )
}
