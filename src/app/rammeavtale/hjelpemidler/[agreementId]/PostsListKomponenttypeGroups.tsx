'use client'

import { PostWithProducts } from '@/utils/agreement-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Alert, Heading, HelpText, HStack, Loader, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { ProductCardAgreement } from '@/app/rammeavtale/hjelpemidler/[agreementId]/ProductCardAgreement'
import { Product, ProductVariant } from '@/utils/product-util'

export const PostsListKomponenttypeGroups = ({
                                               posts,
                                               postLoading,
                                             }: {
  posts: PostWithProducts[]
  postLoading: boolean
}) => {
  const { setCompareMenuState } = useHydratedCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  const handleCompareClick = () => {
    if (firstCompareClick) {
      setCompareMenuState(CompareMenuState.Open)
    }
    setFirstCompareClick(false)
  }

  const getKomponenttyperForProduct = (productWithRank: PostWithProducts['products'][number]): string[] => {
    const variants = (productWithRank.product as Product).variants ?? []
    const values = new Set<string>()

    for (const variant of variants) {
      const techData = (variant as ProductVariant).techData ?? {}
      const entry = techData['Komponenttype']
      if (!entry || !entry.value) continue

      const raw = entry.value
      raw
        .split(/[;,]/)
        .map((v) => v.trim())
        .filter(Boolean)
        .forEach((v) => values.add(v))
    }

    return values.size > 0 ? Array.from(values) : ['Uten komponenttype']
  }

  const groupProductsByKomponenttype = (posts: PostWithProducts[]) => {
    return posts.map((post) => {
      const productsByKomponenttype = post.products.reduce(
        (acc, productWithRank) => {
          const komponenttyper = getKomponenttyperForProduct(productWithRank)

          komponenttyper.forEach((komponenttype) => {
            if (!acc[komponenttype]) {
              acc[komponenttype] = []
            }
            acc[komponenttype].push(productWithRank)
          })

          return acc
        },
        {} as { [key: string]: PostWithProducts['products'] }
      )

      // flag: does this post have any komponenttype other than "Uten komponenttype"?
      const hasNonDefaultKomponenttype = Object.keys(productsByKomponenttype).some(
        (k) => k !== 'Uten komponenttype'
      )

      return {
        ...post,
        productsByKomponenttype,
        hasNonDefaultKomponenttype,
      }
    })
  }

  const groupedPosts = groupProductsByKomponenttype(posts)

  return (
    <VStack as="ol" gap={{ xs: '8', md: '12' }} className="agreement-search-results" id="agreementSearchResults">
      {groupedPosts.map((post) => (
        <VStack as="li" key={post.nr} gap={{ xs: '4', md: '8' }} className="agreement-post spacing-top--small">
          <HStack gap="4" align="center">
            <Heading level="2" size="small" className="agreement-page__post-heading">
              {post.title}
            </Heading>
            <HelpText title="Om delkontrakten">{post.description}</HelpText>
          </HStack>

          {post.products.length === 0 && postLoading && (
            <HStack justify="center" style={{ marginTop: '18px' }}>
              <Loader size="medium" title="Laster hjelpemidler" />
            </HStack>
          )}

          {post.products.length === 0 && !postLoading && (
            <Alert variant="info">Delkontrakten inneholder ingen hjelpemidler</Alert>
          )}

          {Object.entries(post.productsByKomponenttype ?? {}).map(([komponenttype, products]) => (
            <VStack key={komponenttype} gap="4">
              {post.hasNonDefaultKomponenttype && komponenttype !== 'Uten komponenttype' && (
                <Heading level="3" size="small">
                  {komponenttype}
                </Heading>
              )}

              <HStack gap="4">
                {products.map((productWithRank) => (
                  <ProductCardAgreement
                    key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                    product={productWithRank.product}
                    rank={productWithRank.rank}
                    variantCount={productWithRank.variantCount ?? 0}
                    handleCompareClick={handleCompareClick}
                  />
                ))}
              </HStack>
            </VStack>
          ))}
        </VStack>
      ))}
    </VStack>
  )
}
