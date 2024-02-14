'use client'

import { PostWithProducts } from '@/utils/agreement-util'
import { SearchData } from '@/utils/api-util'
import { ImageIcon } from '@navikt/aksel-icons'
import { HStack, Heading, Show, ToggleGroup, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { RefObject } from 'react'
import { useFormContext } from 'react-hook-form'
import ProductCardNew from './ProductCardNew'

const AgreementResults = ({ posts, formRef }: { posts: PostWithProducts[]; formRef: RefObject<HTMLFormElement> }) => {
  const formMethods = useFormContext<SearchData>()
  const searchParams = useSearchParams()
  const pictureToggleValue = searchParams.get('hidePictures') ?? 'show-pictures'

  const handleSetToggle = (value: string) => {
    formMethods.setValue('hidePictures', value)
    formRef.current?.requestSubmit()
  }

  return (
    <VStack style={{ maxWidth: '44.375rem' }}>
      <HStack justify="space-between">
        <Show above="md">
          <Heading level="2" size="small">
            Delkontrakter
          </Heading>
        </Show>
        <ToggleGroup
          defaultValue="show-pictures"
          onChange={handleSetToggle}
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
      <VStack as="ol" gap={{ xs: '4', md: '7' }} className="agreement-search-results" id="agreementSearchResults">
        {posts.map((post) => (
          <VStack as="li" key={post.nr} className="agreement-post" gap={{ xs: '2', md: '4' }}>
            <Heading level="3" size="xsmall" className="spacing-vertical--small">
              {`${post.nr}: ${post.title}`}
            </Heading>
            <HStack gap={'4'}>
              {post.products.map((productWithRank) => (
                <ProductCardNew
                  key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                  product={productWithRank.product}
                  rank={productWithRank.rank}
                  hidePictures={pictureToggleValue === 'hide-pictures'}
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
