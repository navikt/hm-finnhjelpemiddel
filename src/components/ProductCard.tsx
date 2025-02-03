'use client'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { MultiplyIcon } from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Box, Button, Detail, Heading, HGrid, Link, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import AgreementIcon from './AgreementIcon'
import ProductImage from './ProductImage'
import { logNavigationEvent } from '@/utils/amplitude'
import { CompareCheckbox } from '@/components/CompareCheckbox'

const ProductCard = ({
  type,
  product,
  linkOverwrite,
  rank,
  hmsNumbers,
  variantCount,
  handleCompareClick,
}: {
  type: 'removable' | 'checkbox' | 'plain' | 'horizontal'
  product: Product
  linkOverwrite?: string
  rank?: number
  hmsNumbers?: string[]
  variantCount?: number
  handleCompareClick?: () => void
}) => {
  const { productsToCompare } = useHydratedCompareStore()
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || undefined)
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))
  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  const searchParams = useSearchParams()
  const linkToProduct = linkOverwrite || `/produkt/${product.id}?${searchParams}`

  const currentRank = rank ? rank : minRank
  const onAgreement = currentRank !== Infinity
  let cardClassName = ''

  if (type === 'plain') {
    cardClassName = 'product-card'
  } else if (type === 'checkbox') {
    cardClassName = 'product-card--checkbox'
  } else if (type === 'removable') {
    cardClassName = 'product-card--removable'
  } else if (type === 'horizontal') {
    cardClassName = 'product-card--horizontal'
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

  if (type === 'horizontal') {
    return (
      <Box paddingInline="2" paddingBlock="2" className="product-card--horizontal">
        <HGrid gap="1" columns={{ xs: 1, md: 2 }} className="product-card__content">
          <HGrid columns={onAgreement ? '0.3fr 0.7fr' : '1fr'} className="picture-container">
            {onAgreement && <AgreementIcon rank={currentRank} size="xsmall" />}
            <ProductImage src={firstImageSrc} productTitle={product.title} />
          </HGrid>
          {viewHmsOrCount}
          <VStack>
            <Link
              className="product-card__link"
              href={linkToProduct}
              aria-label={`Gå til ${product.title}`}
              as={NextLink}
              onClick={() => logNavigationEvent('Produktkort', 'produkt', product.title)}
            >
              <Heading size="xsmall">{product.title}</Heading>
            </Link>
            <BodyLong size="small" className="product-card__product-description">
              {product.attributes.text}
            </BodyLong>
          </VStack>
        </HGrid>
      </Box>
    )
  }

  return (
    <Box
      padding="2"
      className={classNames(cardClassName, {
        'product-card__checked': isInProductsToCompare && type !== 'plain' && type !== 'removable',
        'extra-info': variantCount || hmsNumbers,
      })}
    >
      {type === 'plain' ? null : type === 'removable' ? (
        <RemoveButton product={product} />
      ) : (
        <CompareCheckbox product={product} handleCompareClick={handleCompareClick} />
      )}
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

          {type === 'checkbox' && <Detail>{product.supplierName}</Detail>}
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
