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
  withIsoButton = false,
  formRef,
}: {
  product: Product
  rank?: number
  hidePictures?: boolean
  withIsoButton?: boolean
  formRef?: RefObject<HTMLFormElement>
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
  console.log('min rank?', minRank)
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

  if (hidePictures) {
    return (
      <Box
        paddingInline="2"
        paddingBlock="1"
        className={classNames('product-card no-picture', { checked: isInProductsToCompare })}
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
      className={classNames('product-card large with-compare-button', {
        checked: isInProductsToCompare,
        'iso-button': withIsoButton,
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
          {withIsoButton && (
            <Button
              className="product-card__iso-button"
              variant="tertiary-neutral"
              icon={<PackageIcon />}
              onClick={() => {
                setValue(`filters.produktkategori`, [product.isoCategoryTitle])
                formRef && formRef.current?.requestSubmit()
              }}
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
