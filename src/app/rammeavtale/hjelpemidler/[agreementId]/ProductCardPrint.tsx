'use client'

import { Product } from '@/utils/product-util'
import { BodyShort, Box, Detail, VStack } from '@navikt/ds-react'

export const ProductCardPrint = ({
  product,
  rank,
  hmsNumbers,
  variantCount,
}: {
  product: Product
  rank?: number
  hmsNumbers?: string[]
  variantCount?: number
}) => {
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
    <Box paddingInline="2" paddingBlock="1" className="product-card--print">
      <VStack gap="1">
        <BodyShort size="small" className="text-line-clamp">
          {rank && rank < 90 ? `${rank}: ${product.title}` : `${product.title}`}
        </BodyShort>
        {viewHmsOrCount}
        <Detail textColor="subtle">{product.supplierName}</Detail>
      </VStack>
    </Box>
  )
}
