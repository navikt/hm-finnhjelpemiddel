'use client'

import { PostWithProducts } from '@/utils/agreement-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { FormSearchData } from '@/utils/search-state-util'
import { Alert, Heading, HStack, Loader, ReadMore, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import ProductCard from '@/components/ProductCard'

const PostsListIsoGroups = ({
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

  const groupProductsByIsoCategory = (posts: PostWithProducts[]) => {
    return posts.map(post => {
      const productsByIsoCategory = post.products.reduce((acc, productWithRank) => {
        const isoCategory = productWithRank.product.isoCategoryTitle;
        if (!acc[isoCategory]) {
          acc[isoCategory] = [];
        }
        acc[isoCategory].push(productWithRank);
        return acc;
      }, {} as { [key: string]: typeof post.products });

      return {
        ...post,
        productsByIsoCategory,
      };
    });
  };

  const groupedPosts = groupProductsByIsoCategory(posts);

  return (
    <VStack
      as="ol"
      gap={{ xs: '8', md: pictureToggleValue === 'hide-pictures' ? '10' : '12' }}
      className="agreement-search-results"
      id="agreementSearchResults"
    >
      {groupedPosts.map((post) => (
        <VStack
          as="li"
          key={post.nr}
          gap={{ xs: '4', md: pictureToggleValue === 'hide-pictures' ? '6' : '8' }}
          className={
            pictureToggleValue === 'hide-pictures'
              ? 'agreement-post spacing-top--xsmall'
              : 'agreement-post spacing-top--small'
          }
        >
          <VStack gap="4">
            <Heading level="2" size="small" className="agreement-page__post-heading">
              {post.title}
            </Heading>
            <span style={{ maxWidth: '840px' }}>
              <ReadMore
                header="Mer informasjon"
                style={{ paddingBottom: '4px' }}
                defaultOpen={post.products.length === 0 && !postLoading}
              >
                {post.description}
              </ReadMore>
            </span>
          </VStack>
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
                    {pictureToggleValue === 'hide-pictures' ? (
                      <ProductCard
                        key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                        type={'no-picture'}
                        product={productWithRank.product}
                        linkOverwrite={`/produkt/${productWithRank.product.id}?status=På%20avtale`}
                        rank={productWithRank.rank}
                        hmsNumbers={productWithRank.hmsNumbers}
                        variantCount={productWithRank.variantCount}
                        handleCompareClick={handleCompareClick}
                      />
                    ) : (
                      <ProductCard
                        key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                        type={'new'}
                        product={productWithRank.product}
                        linkOverwrite={`/produkt/${productWithRank.product.id}?status=På%20avtale`}
                        rank={productWithRank.rank}
                        hmsNumbers={productWithRank.hmsNumbers}
                        variantCount={productWithRank.variantCount}
                        handleCompareClick={handleCompareClick}
                      />
                    )}
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
