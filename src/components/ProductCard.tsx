'use client'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { MultiplyIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Detail, Link, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import ProductImage from './ProductImage'
import { logNavigationEvent } from '@/utils/amplitude'

const ProductCard = ({
  type,
  product,
  linkOverwrite,
  rank,
  hmsNumbers,
  variantCount,
}: {
  type: 'removable' | 'plain'
  product: Product
  linkOverwrite?: string
  rank?: number
  hmsNumbers?: string[]
  variantCount?: number
}) => {
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || undefined)
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))

  const searchParams = useSearchParams()
  const linkToProduct = linkOverwrite || `/produkt/${product.id}?${searchParams}`

  const currentRank = rank ? rank : minRank
  const onAgreement = currentRank !== Infinity
  let cardClassName = ''

  if (type === 'plain') {
    cardClassName = 'product-card'
  } else if (type === 'removable') {
    cardClassName = 'product-card--removable'
  }

  const viewHmsOrCount = (
    <>
      {hmsNumbers && hmsNumbers?.length === 1 && (
        <Detail className="product-card__hms-numbers">{hmsNumbers.join(', ')}</Detail>
      )}
      {((variantCount && hmsNumbers && hmsNumbers?.length > 1) || (variantCount && !hmsNumbers)) && (
        <Detail>Ant varianter: {variantCount}</Detail>
      )}
    </>
  )

  return (
    <Box
      padding="2"
      className={classNames(cardClassName, {
        'extra-info': variantCount || hmsNumbers,
      })}
    >
      {type === 'removable' && <RemoveButton product={product} />}
      <VStack justify="space-between" className="product-card__content" style={{ marginTop: '2px', gap: '2px' }}>
        <VStack style={{ gap: '2px' }}>
          <Detail textColor="subtle">
            {onAgreement ? (currentRank < 90 ? `Rangering ${currentRank}` : 'På avtale med Nav') : ''}
          </Detail>

          {viewHmsOrCount}
          <Link
            className="product-card__link"
            href={linkToProduct}
            aria-label={`Gå til ${product.title}`}
            as={NextLink}
            onClick={() => logNavigationEvent('Produktkort', 'produkt', product.title)}
          >
            <BodyShort size="small" className="text-line-clamp">
              {product.title}
            </BodyShort>
          </Link>
        </VStack>

        <ProductImage src={firstImageSrc} productTitle={product.title} />
      </VStack>
    </Box>
  )
}

const RemoveButton = ({ product }: { product: Product }) => {
  const { removeProduct } = useHydratedCompareStore()

  return (
    <Button
      variant="tertiary-neutral"
      className="product-card__remove-button"
      onClick={() => removeProduct(product.id)}
      icon={<MultiplyIcon title="Fjern produkt fra sammenligning" />}
    />
  )
}

export default ProductCard
