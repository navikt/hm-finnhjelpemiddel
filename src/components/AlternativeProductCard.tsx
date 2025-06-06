'use client'

import { BodyShort, Box, Detail, Link, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import ProductImage from './ProductImage'
import { useSearchParams } from 'next/navigation'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import { useHydratedAlternativeProductsCompareStore } from '@/utils/compare-alternatives-state-util'
import { Product } from '@/utils/product-util'
import { useState } from 'react'

const AlternativeProductCard = ({
  product,
}: {
  product: Product
  minRank?: number
  imageSrc?: string
  handleCompareClick?: () => void
}) => {
  const { alternativeProductsToCompare } = useHydratedAlternativeProductsCompareStore()
  const isInProductsToCompare =
    alternativeProductsToCompare.filter((procom: AlternativeProduct) => product.variants[0].id === procom.id).length >=
    1

  const [imageSrc] = useState(product.photos.at(0)?.uri || undefined)
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))
  const currentRank = minRank
  const onAgreement = currentRank !== Infinity

  let cardClassName = 'product-card--removable'
  const searchParams = useSearchParams()
  const linkToProduct = `/produkt/${product.id}?${searchParams}`
  return (
    <Box
      padding="2"
      className={classNames(cardClassName, {
        'product-card__checked': isInProductsToCompare,
      })}
    >
      <VStack justify="space-between" className="product-card__content" style={{ marginTop: '2px', gap: '2px' }}>
        <VStack style={{ gap: '2px' }}>
          <Detail textColor="subtle">
            {onAgreement ? (currentRank < 90 ? `Rangering ${currentRank}` : 'På avtale med Nav') : ''}
          </Detail>
          <Link
            className="product-card__link"
            href={linkToProduct}
            aria-label={`Gå til ${product.variants[0].articleName}`}
            as={NextLink}
          >
            <BodyShort size="small" className="text-line-clamp">
              {product.variants[0].articleName}
            </BodyShort>
          </Link>
        </VStack>

        <ProductImage src={imageSrc} productTitle={product.variants[0].articleName} />
      </VStack>
    </Box>
  )
}

export default AlternativeProductCard
