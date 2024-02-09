'use client'
import { smallImageLoader } from '@/utils/image-util'
import { Product } from '@/utils/product-util'
import { PackageIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Checkbox, Detail, HStack, Link, VStack } from '@navikt/ds-react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useState } from 'react'

export const ProductCardNew = ({
  product,
  rank,
  hidePictures,
}: {
  product: Product
  rank?: number
  hidePictures: boolean
}) => {
  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const compareCheckbox = (
    <Checkbox className="new-product-card__checkbox" size="small" value="Legg produktet til sammenligning">
      <div aria-label={`sammenlign ${product.title}`}>
        <span aria-hidden>Sammenlign</span>
      </div>
    </Checkbox>
  )

  if (hidePictures) {
    return (
      <Box padding="2" className="new-product-card--no-picture">
        {compareCheckbox}
        <HStack gap="2" className="new-product-card__content"></HStack>
      </Box>
    )
  }

  return (
    <Box padding="2" className="new-product-card--large">
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
            <BodyShort size="small">{product.title}</BodyShort>
          </Link>
          <Button
            className="new-product-card__product-category-button"
            variant="tertiary-neutral"
            icon={<PackageIcon />}
          >
            {product.isoCategoryTitle}
          </Button>
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
