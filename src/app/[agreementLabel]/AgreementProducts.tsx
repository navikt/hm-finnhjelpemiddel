'use client'
import Image from 'next/image'
import NextLink from 'next/link'

import { Agreement, mapPostWithProducts } from '@/utils/agreement-util'
import { getProductsOnAgreement } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import { PostAggregationResponse } from '@/utils/response-types'
import { BodyShort, Box, Button, Checkbox, Detail, HStack, Heading, Link, VStack } from '@navikt/ds-react'
// import { getAgreementFromLabel } from '@/utils/api-util
import { smallImageLoader } from '@/utils/image-util'
import { PackageIcon } from '@navikt/aksel-icons'
import { useState } from 'react'
import useSWR from 'swr'

const AgreementProducts = ({ agreement }: { agreement: Agreement }) => {
  const { data, error, isLoading } = useSWR<PostAggregationResponse>(agreement.id, getProductsOnAgreement)

  if (!data) {
    return <BodyShort>Finner ikke data</BodyShort>
  }
  const posts = mapPostWithProducts(data, agreement).posts
  // console.log('agreement', agreement)
  // console.log('products', posts)

  const getPostTitle = (postNr: number) => agreement.posts.find((post) => post.nr === postNr)?.title

  return (
    <VStack className="search-agreement-posts" gap="8">
      {posts.map((post) => (
        <VStack key={post.nr} className="agreement-post" gap="4">
          <Heading level="2" size="small" className="spacing-vertical--small">
            {post.title}
          </Heading>
          <HStack gap={'4'}>
            {post.products.map((productWithRank) => (
              <ProductCardNew product={productWithRank.product} rank={productWithRank.rank}></ProductCardNew>
            ))}
          </HStack>
        </VStack>
      ))}
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

export default AgreementProducts
