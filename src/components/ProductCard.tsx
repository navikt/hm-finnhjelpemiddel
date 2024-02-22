import { SearchData } from '@/utils/api-util'
import { useHydratedCompareStore } from '@/utils/compare-state-util'
import { Product } from '@/utils/product-util'
import { PackageIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Checkbox, Detail, HStack, Link, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { RefObject, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import ProductImage from './ProductImage'

const ProductCard = ({
  product,
  rank,
  hidePictures = false,
  formRef,
  size,
  handleIsoButton,
}: {
  product: Product
  rank?: number
  hidePictures?: boolean
  formRef?: RefObject<HTMLFormElement>
  size?: 'large'
  handleIsoButton?: (value: string) => void
}) => {
  const { setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()
  const { setValue } = useFormContext<SearchData>()

  const toggleCompareProduct = () => {
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product)
      : setProductToCompare(product)

    // if (firstChecked) {
    //   setCompareMenuState(CompareMenuState.Open)
    //   setFirstChecked(false)
    // }
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  const [firstImageSrc] = useState(product.photos.at(0)?.uri || undefined)
  const minRank = product.agreements && Math.min(...product.agreements.map((agreement) => agreement.rank))

  const currentRank = rank ? rank : minRank

  //TODO sjekk at klikkflate er minst 24x24
  const compareCheckbox = (
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

  const cardClassName = size ? 'product-card--large' : 'product-card--compare'

  if (hidePictures) {
    return (
      <Box
        paddingInline="2"
        paddingBlock="1"
        className={classNames('product-card--no-picture', { 'product-card__checked': isInProductsToCompare })}
      >
        <VStack gap="1" className="product-card__content">
          <HStack justify={'space-between'}>
            <Detail textColor="subtle">
              {rank ? (rank < 90 ? `Rangering ${rank}` : 'Ingen rangering') : 'Ikke på avtale'}
            </Detail>
            {compareCheckbox}
          </HStack>
          <Link
            className="product-card__link"
            href={`/produkt/${product.id}`}
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

  return (
    <Box
      padding="2"
      className={classNames(cardClassName, {
        'product-card__checked': isInProductsToCompare,
      })}
    >
      {compareCheckbox}
      <VStack justify="space-between" className="product-card__content" style={{ marginTop: '2px', gap: '2px' }}>
        <VStack style={{ gap: '2px' }}>
          <Detail textColor="subtle">
            {currentRank ? (currentRank < 90 ? `Rangering ${currentRank}` : 'På avtale med NAV') : ''}
          </Detail>
          <Link
            className="product-card__link"
            href={`/produkt/${product.id}`}
            aria-label={`Gå til ${product.title}`}
            as={NextLink}
          >
            <BodyShort size="small" className="text-line-clamp">
              {product.title}
            </BodyShort>
          </Link>
          {size === 'large' && handleIsoButton && (
            <Button
              className="product-card--large__iso-button"
              variant="tertiary-neutral"
              icon={<PackageIcon />}
              onClick={() => handleIsoButton(product.isoCategoryTitle)}
            >
              {product.isoCategoryTitle}
            </Button>
          )}
        </VStack>

        <ProductImage src={firstImageSrc} />
      </VStack>
    </Box>
  )
}

export default ProductCard
