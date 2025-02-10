'use client'

import { Product } from '@/utils/product-util'
import { BodyLong, Box, Heading, HGrid, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import AgreementIcon from '@/components/AgreementIcon'
import ProductImage from '@/components/ProductImage'
import { logNavigationEvent } from '@/utils/amplitude'

export const ProductCardHorizontal = ({ product }: { product: Product }) => {
  const searchParams = useSearchParams()
  const linkToProduct = `/produkt/${product.id}?${searchParams}`

  const currentRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))
  const onAgreement = currentRank !== Infinity

  return (
    <Box paddingInline="2" paddingBlock="2" className="product-card--horizontal">
      <HGrid gap="1" columns={{ xs: 1, md: 2 }} className="product-card__content">
        <HGrid columns={onAgreement ? '0.3fr 0.7fr' : '1fr'} className="picture-container">
          {onAgreement && <AgreementIcon rank={currentRank} size="xsmall" />}
          <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
        </HGrid>
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
