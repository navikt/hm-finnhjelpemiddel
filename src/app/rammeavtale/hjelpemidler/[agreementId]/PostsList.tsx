'use client'

import { PostWithProducts } from '@/utils/agreement-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { FormSearchData } from '@/utils/search-state-util'
import { Alert, Heading, HStack, Loader, ReadMore, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ProductCardNew } from '@/app/rammeavtale/hjelpemidler/[agreementId]/ProductCardNew'
import { ProductCardNoPicture } from '@/app/rammeavtale/hjelpemidler/[agreementId]/ProductCardNoPicture'

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
      gap={{ xs: '8', md: pictureToggleValue === 'hide-pictures' ? '10' : '12' }}
      className="agreement-search-results"
      id="agreementSearchResults"
    >
      {posts.map((post) => (
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
          <HStack as="ol" gap={'4'}>
            {post.products.map((productWithRank) => (
              <li key={productWithRank.product.id}>
                {pictureToggleValue === 'hide-pictures' ? (
                  <ProductCardNoPicture
                    key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                    product={productWithRank.product}
                    linkOverwrite={`/produkt/${productWithRank.product.id}?status=På%20avtale`}
                    rank={productWithRank.rank}
                    hmsNumbers={productWithRank.hmsNumbers}
                    variantCount={productWithRank.variantCount}
                    handleCompareClick={handleCompareClick}
                  />
                ) : (
                  <ProductCardNew
                    key={`${productWithRank.product.id} + ${productWithRank.rank}`}
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
  )
}

export default PostsList
