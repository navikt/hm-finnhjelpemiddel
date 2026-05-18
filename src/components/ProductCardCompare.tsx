'use client'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { MultiplyIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Detail, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ProductImage from './ProductImage'
import useQueryString from '@/utils/search-params-util'

const ProductCardCompare = ({
  type,
  product,
  rank,
}: {
  type: 'removable' | 'plain'
  product: Product
  rank?: number
}) => {
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))

  const searchParams = useSearchParams()
  const linkToProduct = `/produkt/${product.id}?${searchParams}`

  const currentRank = rank ? rank : minRank
  const onAgreement = currentRank !== Infinity
  let cardClassName = ''

  if (type === 'plain') {
    cardClassName = 'product-card'
  } else if (type === 'removable') {
    cardClassName = 'product-card--removable'
  }

  return (
    <Box padding="space-8" className={cardClassName}>
      {type === 'removable' && <RemoveButton product={product} />}
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

        <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
      </VStack>
    </Box>
  )
}

const RemoveButton = ({ product }: { product: Product }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { removeProduct } = useHydratedCompareStore()
  const { createQueryStringAppend } = useQueryString()

  return (
    <Button
      variant="tertiary-neutral"
      className="product-card__remove-button"
      onClick={() => {
        removeProduct(product.id)
        router.replace(`${pathname}?${createQueryStringAppend('id', product.id)}`, { scroll: false })
        router.refresh() //Hacky fix på https://github.com/vercel/next.js/issues/92152 i next 16.2
      }}
      icon={<MultiplyIcon title="Fjern produkt fra sammenligning" />}
    />
  )
}

export default ProductCardCompare
