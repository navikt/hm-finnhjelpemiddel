'use client'

import { MultiplyIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Detail, Link, VStack, } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import ProductImage from './ProductImage'
import { useSearchParams } from "next/navigation";
import { AlternativeProduct } from "@/app/alternativprodukter/alternative-util";
import { useHydratedAlternativeProductsCompareStore } from "@/utils/compare-alternatives-state-util";

const RemovableAlternativeProductCardMenu = ({
  product,
}: {
  product: AlternativeProduct
  minRank?: number
  imageSrc?: string
  handleCompareClick?: () => void
}) => {
  const { alternativeProductsToCompare } = useHydratedAlternativeProductsCompareStore()
  const isInProductsToCompare = alternativeProductsToCompare.filter((procom: AlternativeProduct) => product.id === procom.id).length >= 1


  const imageSrc=  product.imageUri
  const minRank = product.highestRank
  const currentRank = minRank
  const onAgreement = currentRank !== Infinity

  let cardClassName = 'product-card--removable'
  const searchParams = useSearchParams()
  const linkToProduct = `/produkt/${product.seriesId}?${searchParams}`
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
            aria-label={`Gå til ${product.variantTitle}`}
            as={NextLink}
          >
            <BodyShort size="small" className="text-line-clamp">
              {product.variantTitle}
            </BodyShort>
          </Link>

        </VStack>

        <ProductImage src={imageSrc} productTitle={product.variantTitle} />
      </VStack>
    </Box>
  )
}

const RemoveButton = ({ productId }: { productId: string }) => {
  const { removeAlternativeProduct } = useHydratedAlternativeProductsCompareStore()

  return (
    <Button
      variant="tertiary-neutral"
      className="product-card__remove-button"
      onClick={() => removeAlternativeProduct(productId)}
      icon={<MultiplyIcon title="Fjern produkt fra sammenligning" />}
    />
  )
}

export default RemovableAlternativeProductCardMenu
