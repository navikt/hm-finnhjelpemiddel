'use client'

import { PostWithProducts } from '@/utils/agreement-util'
import { ImageIcon } from '@navikt/aksel-icons'
import { HStack, Heading, ToggleGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import ProductCardNew from './ProductCardNew'

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

export default AgreementResults
