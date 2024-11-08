'use client'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { ComparableProduct, Product } from '@/utils/product-util'
import { MultiplyIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Detail, Link, VStack, } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import ProductImage from './ProductImage'
import { useSearchParams } from "next/navigation";
import { AlternativeProduct } from "@/app/alternativprodukter/alternative-util";
import { useState } from "react";

const SimpleRemovableProductCard = ({
  product,
}: {
  product: ComparableProduct
  minRank?: number
  imageSrc?: string
  handleCompareClick?: () => void
}) => {
  const { productsToCompare } = useHydratedCompareStore()
  const isInProductsToCompare = productsToCompare.filter((procom: ComparableProduct) => product.id === procom.id).length >= 1

  const imageSrc = isAlternativeProduct(product)
    ? product.imageUri
    : product.photos.at(0)?.uri || undefined;

  const minRank = isAlternativeProduct(product) ? product.highestRank : Math.min(...product.agreements.map((agreement) => agreement.rank))

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
      <RemoveButton productId={product.id} />
      <VStack justify="space-between" className="product-card__content" style={{ marginTop: '2px', gap: '2px' }}>
        <VStack style={{ gap: '2px' }}>
          <Detail textColor="subtle">
            {onAgreement ? (currentRank < 90 ? `Rangering ${currentRank}` : 'På avtale med Nav') : ''}
          </Detail>
          <Link
            className="product-card__link"
            href={linkToProduct}
            aria-label={`Gå til ${product.title}`}
            as={NextLink}
          >
            <BodyShort size="small" className="text-line-clamp">
              {product.title}
            </BodyShort>
          </Link>

        </VStack>

        <ProductImage src={imageSrc} productTitle={product.title} />
      </VStack>
    </Box>
  )
}

const RemoveButton = ({ productId }: { productId: string }) => {
  const { removeProduct } = useHydratedCompareStore()

  return (
    <Button
      variant="tertiary-neutral"
      className="product-card__remove-button"
      onClick={() => removeProduct(productId)}
      icon={<MultiplyIcon title="Fjern produkt fra sammenligning" />}
    />
  )
}

function isAlternativeProduct(product: Product | AlternativeProduct): product is AlternativeProduct {
  return (product as AlternativeProduct).warehouseStock !== undefined
}

export default SimpleRemovableProductCard
