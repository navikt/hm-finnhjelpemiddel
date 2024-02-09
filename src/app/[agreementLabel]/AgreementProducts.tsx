'use client'
import Image from 'next/image'
import NextLink from 'next/link'

import { PostWithProducts } from '@/utils/agreement-util'
import { smallImageLoader } from '@/utils/image-util'
import { Product } from '@/utils/product-util'
import { ImageIcon, PackageIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Checkbox, Detail, HStack, Heading, Link, ToggleGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'

const AgreementResults = ({ posts }: { posts: PostWithProducts[] }) => {
  const [showPictures, setShowPictures] = useState<string>('show-pictures')

  return (
    <VStack style={{ maxWidth: '44.375rem' }}>
      <HStack justify="space-between">
        <Heading level="2" size="small">
          Delkontrakter
        </Heading>
        <ToggleGroup
          defaultValue="show-pictures"
          onChange={setShowPictures}
          value={showPictures}
          size="small"
          variant="neutral"
        >
          <ToggleGroup.Item value="show-pictures">
            <ImageIcon aria-hidden />
            Vis bilde
          </ToggleGroup.Item>
          <ToggleGroup.Item value="no-pictures">Uten bilde</ToggleGroup.Item>
        </ToggleGroup>
      </HStack>
      <VStack as="ol" gap="7" className="agreement-search-results" id="agreementSearchResults">
        {posts.map((post) => (
          <VStack as="li" key={post.nr} className="agreement-post" gap="4">
            <Heading level="3" size="small" className="spacing-vertical--small">
              {post.title}
            </Heading>
            <HStack gap={'4'}>
              {post.products.map((productWithRank) => (
                <ProductCardNew
                  key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                  product={productWithRank.product}
                  rank={productWithRank.rank}
                ></ProductCardNew>
              ))}
            </HStack>
          </VStack>
        ))}
      </VStack>
    </VStack>
  )
}

const ProductCardNew = ({ product, rank }: { product: Product; rank?: number }) => {
  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  return (
    <Box padding="2" className="new-product-card">
      <Checkbox
        className="new-product-card__checkbox"
        size="small"
        value="Legg produktet til sammenligning"
        // onChange={toggleCompareProduct}
        // checked={isInProductsToCompare}
      >
        <div aria-label={`sammenlign ${product.title}`}>
          <span aria-hidden>Sammenlign</span>
        </div>
      </Checkbox>
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

export default AgreementResults
