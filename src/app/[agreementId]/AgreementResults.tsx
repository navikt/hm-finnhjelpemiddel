'use client'

import ProductCard from '@/components/ProductCard'
import { PostWithProducts } from '@/utils/agreement-util'
import { SearchData } from '@/utils/api-util'
import { ImageIcon } from '@navikt/aksel-icons'
import { Alert, HStack, Heading, Show, ToggleGroup, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { RefObject } from 'react'
import { useFormContext } from 'react-hook-form'

const AgreementResults = ({ posts, formRef }: { posts: PostWithProducts[]; formRef: RefObject<HTMLFormElement> }) => {
  const formMethods = useFormContext<SearchData>()
  const searchParams = useSearchParams()
  const pictureToggleValue = searchParams.get('hidePictures') ?? 'show-pictures'

  const handleSetToggle = (value: string) => {
    formMethods.setValue('hidePictures', value)
    formRef.current?.requestSubmit()
  }

  const handleSetIsoFilter = (value: string) => {
    formMethods.setValue(`filters.produktkategori`, [value])
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
      <VStack
        as="ol"
        gap={{ xs: '4', md: pictureToggleValue === 'hide-pictures' ? '4' : '6' }}
        className="agreement-search-results"
        id="agreementSearchResults"
      >
        {posts.map((post) => (
          <VStack
            as="li"
            key={post.nr}
            className="agreement-post"
            gap={{ xs: '2', md: pictureToggleValue === 'hide-pictures' ? '2' : '4' }}
          >
            <Heading
              level="3"
              size="xsmall"
              className={pictureToggleValue === 'hide-pictures' ? 'spacing-top--xsmall' : 'spacing-top--small'}
            >
              {`${post.nr}: ${post.title}`}
            </Heading>
            <HStack as="ol" gap={'4'}>
              {post.products.map((productWithRank) => (
                <li>
                  <ProductCard
                    key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                    product={productWithRank.product}
                    rank={productWithRank.rank}
                    hidePictures={pictureToggleValue === 'hide-pictures'}
                    handleIsoButton={handleSetIsoFilter}
                  ></ProductCard>
                </li>
              ))}
            </HStack>
          </VStack>
        ))}
      </VStack>
      {posts.length === 0 && <Alert variant="info">Obs! Fant ingen hjelpemiddel. Har du sjekket filtrene dine?</Alert>}
    </VStack>
  )
}

export default AgreementResults
