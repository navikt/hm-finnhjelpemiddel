'use client'

import { useState } from 'react'

import NextLink from 'next/link'

import { MultiplyIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Detail, Link, VStack } from '@navikt/ds-react'

import { Product } from '../utils/product-util'
import ProductImage from './ProductImage'

type ProductCardProps = {
  product: Product
  removeProduct?: (product: Product) => void
  rank?: number
  showRank?: boolean
}

const ProductCardCompare = ({ product, removeProduct, rank, showRank }: ProductCardProps) => {
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || undefined)

  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))
  return (
    <Box padding="2" className="product-card large product-card-compare">
      {/* <div className={removeProduct ? 'product-card-compare border' : 'product-card-compare'}> */}
      <div className="product-card__content">
        {removeProduct && (
          <Button
            variant="tertiary-neutral"
            className="remove-button"
            onClick={() => removeProduct(product)}
            icon={<MultiplyIcon title="Fjern produkt fra sammenligning" />}
          />
        )}

        <ProductImage src={firstImageSrc} />
        <VStack style={{ gap: '2px' }}>
          {showRank && (
            <Detail textColor="subtle">
              {minRank ? (minRank < 90 ? `Rangering ${minRank}` : 'På avtale med NAV') : ''}
            </Detail>
          )}
          <Link
            className="product-card__link"
            href={`/produkt/${product.id}`}
            aria-label={`Gå til ${product.title}`}
            as={NextLink}
          >
            <BodyShort size="small" className="text-line-clamp">
              {product.title}
            </BodyShort>
          </Link>
        </VStack>
      </div>
    </Box>
  )
}

export default ProductCardCompare
