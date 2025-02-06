'use client'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { BodyShort, Box, Detail, HStack, Link, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { logNavigationEvent } from '@/utils/amplitude'
import { CompareCheckbox } from '@/components/CompareCheckbox'

export const ProductCardNoPicture = ({
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
  const { productsToCompare } = useHydratedCompareStore()
  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  const searchParams = useSearchParams()
  const linkToProduct = linkOverwrite || `/produkt/${product.id}?${searchParams}`

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
      paddingInline="2"
      paddingBlock="1"
      className={classNames('product-card--no-picture', { 'product-card__checked': isInProductsToCompare })}
    >
      <VStack gap="1" className="product-card__content">
        <HStack justify={'space-between'}>
          {viewHmsOrCount}
          <CompareCheckbox product={product} handleCompareClick={handleCompareClick} />
        </HStack>
        <Detail textColor="subtle">{product.supplierName}</Detail>

        <Link
          className="product-card__link"
          href={linkToProduct}
          aria-label={`Gå til ${product.title}`}
          as={NextLink}
          onClick={() => logNavigationEvent('Produktkort', 'produkt', product.title)}
        >
          <BodyShort size="small" className="text-line-clamp">
            {rank && rank < 90 ? `${rank}: ${product.title}` : `${product.title}`}
          </BodyShort>
        </Link>
      </VStack>
    </Box>
  )
}
