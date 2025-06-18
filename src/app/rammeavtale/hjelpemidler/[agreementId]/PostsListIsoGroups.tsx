'use client'

import { PostWithProducts } from '@/utils/agreement-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Alert, Heading, HelpText, HStack, Loader, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { ProductCardNew } from '@/app/rammeavtale/hjelpemidler/[agreementId]/ProductCardNew'

const PostsListIsoGroups = ({
  posts,
  postLoading,
  postError,
}: {
  posts: PostWithProducts[]
  postLoading: boolean
  postError: boolean
}) => {
  const { setCompareMenuState } = useHydratedCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  const handleCompareClick = () => {
    if (firstCompareClick) {
      setCompareMenuState(CompareMenuState.Open)
    }
    setFirstCompareClick(false)
  }

  const groupProductsByIsoCategory = (posts: PostWithProducts[]) => {
    return posts.map((post) => {
      const productsByIsoCategory = post.products.reduce(
        (acc, productWithRank) => {
          const isoCategory = productWithRank.product.isoCategoryTitle
          if (!acc[isoCategory]) {
            acc[isoCategory] = []
          }
          acc[isoCategory].push(productWithRank)
          return acc
        },
        {} as { [key: string]: typeof post.products }
      )

      return {
        ...post,
        productsByIsoCategory,
      }
    })
  }

  const groupedPosts = groupProductsByIsoCategory(posts)

  return (
    <VStack as="ol" gap={{ xs: '8', md: '12' }} className="agreement-search-results" id="agreementSearchResults">
      {groupedPosts.map((post) => (
        <VStack as="li" key={post.nr} gap={{ xs: '4', md: '8' }} className={'agreement-post'}>
          <HStack gap="4" align={'center'}>
            <Heading level="2" size="small" className="agreement-page__post-heading">
              {post.title}
            </Heading>
            <HelpText title={'Om delkontrakten'}>{post.description}</HelpText>
          </HStack>
          {post.products.length === 0 && postLoading && (
            <HStack justify="center" style={{ marginTop: '18px' }}>
              <Loader size="medium" title="Laster hjelpemidler" />
            </HStack>
          )}
          {post.products.length === 0 && !postLoading && (
            <Alert variant="info">Delkontrakten inneholder ingen hjelpemidler</Alert>
          )}
          {Object.entries(post.productsByIsoCategory).map(([isoCategory, products]) => (
            <VStack key={isoCategory} gap="4">
              <Heading level="3" size="small">
                {isoCategory}
              </Heading>
              <HStack as="ol" gap={'4'}>
                {products.map((productWithRank) => (
                  <li key={productWithRank.product.id}>
                    <ProductCardNew
                      key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                      product={productWithRank.product}
                      linkOverwrite={`/produkt/${productWithRank.product.id}?status=På%20avtale`}
                      rank={productWithRank.rank}
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
      ))}
    </VStack>
  )
}

export default PostsListIsoGroups
