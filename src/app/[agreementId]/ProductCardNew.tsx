import { useHydratedCompareStore } from '@/utils/global-state-util'
import { smallImageLoader } from '@/utils/image-util'
import { Product } from '@/utils/product-util'
import { BodyShort, Box, Checkbox, Detail, HStack, Link, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import Image from 'next/image'
import NextLink from 'next/link'
import { useState } from 'react'

const ProductCardNew = ({
  product,
  rank,
  hidePictures,
}: {
  product: Product
  rank?: number
  hidePictures: boolean
}) => {
  const { setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()

  const toggleCompareProduct = () => {
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product)
      : setProductToCompare(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')
  const [imageLoadingError, setImageLoadingError] = useState(false)

  //TODO sjekk at klikkflate er minst 24x24
  const compareCheckbox = (
    <Checkbox
      className="new-product-card__checkbox"
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
        className={classNames('new-product-card no-picture', { checked: isInProductsToCompare })}
      >
        <VStack gap="1" className="new-product-card__content">
          <HStack justify={'space-between'}>
            <Detail textColor="subtle">{rank ? `Rangering ${rank}` : 'Ingen rangering'}</Detail>
            {compareCheckbox}
          </HStack>
          <Link
            className="new-product-card__link"
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
      className={classNames('new-product-card large without-iso-button', { checked: isInProductsToCompare })}
    >
      {compareCheckbox}
      <VStack gap="2" className="new-product-card__content">
        <VStack gap="1">
          <Detail textColor="subtle">{rank ? `Rangering ${rank}` : 'Ingen rangering'}</Detail>
          <Link
            className="new-product-card__link"
            href={`/produkt/${product.id}`}
            aria-label={`Gå til ${product.title}`}
            as={NextLink}
          >
            <BodyShort size="small" className="text-line-clamp">
              {product.title}
            </BodyShort>
          </Link>
          {/* <Button
            className="new-product-card__product-category-button"
            variant="tertiary-neutral"
            icon={<PackageIcon />}
          >
            {product.isoCategoryTitle}
          </Button> */}
        </VStack>
        <div className="new-product-card-image-container">
          <div className="new-product-card-image">
            {hasImage && !imageLoadingError ? (
              <Image
                loader={smallImageLoader}
                src={firstImageSrc}
                onError={() => {
                  setImageLoadingError(true)
                }}
                alt="Produktbilde"
                fill
                sizes="50vw"
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <Image
                src={'/assets/image-error.png'}
                alt="Produktbilde"
                fill
                style={{ padding: '10px' }}
                sizes="50vw"
                priority
              />
            )}
          </div>
        </div>
      </VStack>
    </Box>
  )
}

export default ProductCardNew
