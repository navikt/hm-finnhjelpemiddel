'use client'

import { Product } from '@/utils/product-util'
import { BodyLong, Box, Detail, Heading, HGrid, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import AgreementIcon from './AgreementIcon'
import ProductImage from './ProductImage'
import { logNavigationEvent } from '@/utils/amplitude'

export const ProductCardHorizontal = ({
  product,
  linkOverwrite,
  rank,
  hmsNumbers,
  variantCount,
}: {
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
