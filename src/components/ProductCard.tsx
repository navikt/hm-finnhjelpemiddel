'use client'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { Product } from '@/utils/product-util'
import { MultiplyIcon, PackageIcon } from '@navikt/aksel-icons'
import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Checkbox,
  Detail,
  HGrid,
  HStack,
  Heading,
  Link,
  VStack,
} from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import AgreementIcon from './AgreementIcon'
import ProductImage from './ProductImage'

const ProductCard = ({
  type,
  product,
  rank,
  hmsNumbers,
  variantCount,
  handleIsoButton,
}: {
  type: 'removable' | 'checkbox' | 'plain' | 'no-picture' | 'large-with-checkbox' | 'print' | 'horizontal'
  product: Product
  rank?: number
  hmsNumbers?: string[]
  variantCount?: number
  handleIsoButton?: (value: string) => void
}) => {
  const { productsToCompare } = useHydratedCompareStore()
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || undefined)
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))
  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  const searchParams = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())

  const queryString = useMemo(() => {
    return new URLSearchParams(params).toString()
  }, [params])

  const searchTerm = searchParams.get('term')
  const searchData = mapSearchParams(searchParams)

  const linkToProduct = `/produkt/${product.id}?${queryString}`

  const currentRank = rank ? rank : minRank
  const onAgreement = currentRank !== Infinity
  let cardClassName = ''

  if (type === 'plain') {
    cardClassName = 'product-card'
  } else if (type === 'large-with-checkbox') {
    cardClassName = 'product-card--large'
  } else if (type === 'checkbox') {
    cardClassName = 'product-card--checkbox'
  } else if (type === 'removable') {
    cardClassName = 'product-card--removable'
  } else if (type === 'no-picture') {
    cardClassName = 'product-card--no-picture'
  } else if (type === 'print') {
    cardClassName = 'product-card--print'
  } else if (type === 'horizontal') {
    cardClassName = 'product-card--horizontal'
  }

  const viewHmsOrCount = (
    <>
      {hmsNumbers && hmsNumbers?.length < 4 && (
        <Detail className="product-card__hms-numbers">{hmsNumbers.join(', ')}</Detail>
      )}
      {((variantCount && hmsNumbers && hmsNumbers?.length >= 4) || (variantCount && !hmsNumbers)) && (
        <Detail>Ant varianter: {variantCount}</Detail>
      )}
    </>
  )

  if (type === 'print') {
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
  if (type === 'no-picture') {
    return (
      <Box
        paddingInline="2"
        paddingBlock="1"
        className={classNames('product-card--no-picture', { 'product-card__checked': isInProductsToCompare })}
      >
        <VStack gap="1" className="product-card__content">
          <HStack justify={'space-between'}>
            <Detail textColor="subtle">
              {onAgreement ? (currentRank < 90 ? `Rangering ${currentRank}` : 'Ingen rangering') : 'Ikke på avtale'}
            </Detail>
            <CompareCheckbox product={product} />
          </HStack>
          {viewHmsOrCount}
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
      </Box>
    )
  }

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
        <CompareCheckbox product={product} />
      )}
      <VStack justify="space-between" className="product-card__content" style={{ marginTop: '2px', gap: '2px' }}>
        <VStack style={{ gap: '2px' }}>
          <Detail textColor="subtle">
            {onAgreement ? (currentRank < 90 ? `Rangering ${currentRank}` : 'På avtale med NAV') : ''}
          </Detail>

          {viewHmsOrCount}
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

          {type === 'large-with-checkbox' && handleIsoButton && (
            <Button
              className="product-card__iso-button"
              variant="tertiary-neutral"
              icon={<PackageIcon />}
              onClick={() => handleIsoButton(product.isoCategoryTitle)}
            >
              {product.isoCategoryTitle}
            </Button>
          )}
        </VStack>

        <ProductImage src={firstImageSrc} productTitle={product.title} />
      </VStack>
    </Box>
  )
}

const CompareCheckbox = ({ product }: { product: Product }) => {
  const { setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()

  const toggleCompareProduct = () => {
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product)
      : setProductToCompare(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1
  return (
    <Checkbox
      className="product-card__checkbox"
      size="small"
      value="Legg produktet til sammenligning"
      onChange={toggleCompareProduct}
      checked={isInProductsToCompare}
    >
      <div aria-label={`sammenlign ${product.title}`}>
        <span aria-hidden>Sammenlign</span>
      </div>
    </Checkbox>
  )
}

const RemoveButton = ({ product }: { product: Product }) => {
  const { removeProduct } = useHydratedCompareStore()

  return (
    <Button
      variant="tertiary-neutral"
      className="product-card__remove-button"
      onClick={() => removeProduct(product)}
      icon={<MultiplyIcon title="Fjern produkt fra sammenligning" />}
    />
  )
}

export default ProductCard
