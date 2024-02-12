'use client'
import Image from 'next/image'
import NextLink from 'next/link'

import { PostWithProducts } from '@/utils/agreement-util'
import { useHydratedCompareStore } from '@/utils/compare-state-util'
import { smallImageLoader } from '@/utils/image-util'
import { Product } from '@/utils/product-util'
import { ImageIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Checkbox, Detail, HStack, Heading, Link, ToggleGroup, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import { useState } from 'react'

const AgreementResults = ({ posts }: { posts: PostWithProducts[] }) => {
  const [pictureToggleValue, setPictureToggleValue] = useState<string>('show-pictures')

  const hidePictures = pictureToggleValue === 'hide-pictures'

  return (
    <VStack style={{ maxWidth: '44.375rem' }}>
      <HStack justify="space-between">
        <Heading level="2" size="small">
          Delkontrakter
        </Heading>
        <ToggleGroup
          defaultValue="show-pictures"
          onChange={setPictureToggleValue}
          value={pictureToggleValue}
          size="small"
          variant="neutral"
        >
          <ToggleGroup.Item value="show-pictures">
            <ImageIcon aria-hidden />
            Vis bilde
          </ToggleGroup.Item>
          <ToggleGroup.Item value="hide-pictures">Uten bilde</ToggleGroup.Item>
        </ToggleGroup>
      </HStack>
      <VStack as="ol" gap="7" className="agreement-search-results" id="agreementSearchResults">
        {posts.map((post) => (
          <VStack as="li" key={post.nr} className="agreement-post" gap="4">
            <Heading level="3" size="xsmall" className="spacing-vertical--small">
              {`DK ${post.nr}: ${post.title}`}
            </Heading>
            <HStack gap={'4'}>
              {post.products.map((productWithRank) => (
                <ProductCardNew
                  key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                  product={productWithRank.product}
                  rank={productWithRank.rank}
                  hidePictures={hidePictures}
                ></ProductCardNew>
              ))}
            </HStack>
          </VStack>
        ))}
      </VStack>
    </VStack>
  )
}

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

    // if (firstChecked) {
    //   setCompareMenuState(CompareMenuState.Open)
    //   setFirstChecked(false)
    // }
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

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
      className={classNames('new-product-card--large without-iso-button', { checked: isInProductsToCompare })}
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
        <div className="new-product-card__image">
          <div className="image">
            {hasImage ? (
              <Image
                loader={smallImageLoader}
                src={firstImageSrc}
                // src={'/assets/image-error.png'}
                // onError={() => {
                //   setImageLoadingError(true)
                // }}
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

        {/* {showRank && agreementRank && <AgreementIcon rank={agreementRank} />} */}
      </VStack>
    </Box>
  )
}

export default AgreementResults
