'use client'

import ProductCard from '@/components/ProductCard'
import { PostWithProducts } from '@/utils/agreement-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { FormSearchData } from '@/utils/search-state-util'
import { Alert, HGrid, HStack, Heading, HelpText, Loader, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

const PostsList = ({
  posts,
  postLoading,
  postError,
}: {
  posts: PostWithProducts[]
  postLoading: boolean
  postError: boolean
}) => {
  const formMethods = useFormContext<FormSearchData>()
  const searchParams = useSearchParams()
  const { setCompareMenuState } = useHydratedCompareStore()
  const pictureToggleValue = searchParams.get('hidePictures') ?? 'show-pictures'
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  const handleCompareClick = () => {
    if (firstCompareClick) {
      setCompareMenuState(CompareMenuState.Open)
    }
    setFirstCompareClick(false)
  }

  return (
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
          gap={{ xs: '2', md: pictureToggleValue === 'hide-pictures' ? '2' : '4' }}
          className={
            pictureToggleValue === 'hide-pictures'
              ? 'agreement-post spacing-top--xsmall'
              : 'agreement-post spacing-top--small'
          }
        >
          <HGrid columns={'auto 30px'} align="start">
            <Heading level="3" size="xsmall">
              {post.title}
            </Heading>
            <HelpText placement="right" strategy="absolute" style={{ paddingBottom: '4px' }}>
              {post.description}
            </HelpText>
          </HGrid>
          {post.products.length === 0 && postLoading && (
            <HStack justify="center" style={{ marginTop: '18px' }}>
              <Loader size="medium" title="Laster hjelpemidler" />
            </HStack>
          )}
          {post.products.length === 0 && !postLoading && (
            <Alert variant="info">Delkontrakten inneholder ingen hjelpemidler</Alert>
          )}
          <HStack as="ol" gap={'4'}>
            {post.products.map((productWithRank) => (
              <li key={productWithRank.product.id}>
                <ProductCard
                  key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                  product={productWithRank.product}
                  linkOverwrite={`/produkt/${productWithRank.product.id}?status=På%20avtale`}
                  rank={productWithRank.rank}
                  type={pictureToggleValue === 'hide-pictures' ? 'no-picture' : 'checkbox'}
                  hmsNumbers={productWithRank.hmsNumbers}
                  variantCount={productWithRank.variantCount}
                  handleCompareClick={handleCompareClick}
                />
              </li>
            ))}
          </HStack>
        </VStack>
      ))}
    </VStack>
  )
}

export default PostsList
