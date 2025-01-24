'use client'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { PackageIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Detail, Link, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { logNavigationSearchEvent } from '@/utils/amplitude'
import ProductImage from '@/components/ProductImage'
import { CompareCheckbox } from '@/components/CompareCheckbox'

const ProductCardSearch = ({
  product,
  handleIsoButton,
  handleCompareClick,
  searchResultPlacement,
}: {
  product: Product
  handleIsoButton: (value: string) => void
  handleCompareClick?: () => void
  searchResultPlacement: number
}) => {
  const { productsToCompare } = useHydratedCompareStore()
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || undefined)
  const searchParams = useSearchParams()
  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))
  const onAgreement = minRank !== Infinity

  return (
    <Box
      padding="2"
      className={classNames('product-card--large', {
        'product-card__checked': isInProductsToCompare,
      })}
    >
      <CompareCheckbox product={product} handleCompareClick={handleCompareClick} />

      <VStack justify="space-between" className="product-card__content" style={{ marginTop: '2px', gap: '2px' }}>
        <VStack style={{ gap: '2px' }}>
          <Detail textColor="subtle">
            {onAgreement ? (minRank < 90 ? `Rangering ${minRank}` : 'På avtale med Nav') : ''}
          </Detail>

          <Link
            className="product-card__link"
            href={`/produkt/${product.id}?${searchParams}`}
            aria-label={`Gå til ${product.title}`}
            as={NextLink}
            onClick={() => logNavigationSearchEvent('Produktkort', 'produkt', product.title, searchResultPlacement)}
          >
            <BodyShort size="small" className="text-line-clamp">
              {product.title}
            </BodyShort>
          </Link>

          <Button
            className="product-card__iso-button"
            variant="tertiary-neutral"
            icon={<PackageIcon aria-hidden />}
            onClick={() => handleIsoButton(product.isoCategoryTitle)}
          >
            {product.isoCategoryTitle}
          </Button>
        </VStack>

        <ProductImage src={firstImageSrc} productTitle={product.title} />
      </VStack>
    </Box>
  )
}

export default ProductCardSearch
