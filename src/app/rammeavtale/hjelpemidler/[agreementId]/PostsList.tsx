'use client'

import { ProductCardAgreement } from '@/app/rammeavtale/hjelpemidler/[agreementId]/ProductCardAgreement'

import { useEffect } from 'react'

import { Alert, HStack, Heading, HelpText, Loader, VStack } from '@navikt/ds-react'

import { PostWithProducts } from '@/utils/agreement-util'

const PostsList = ({ posts, postLoading }: { posts: PostWithProducts[]; postLoading: boolean }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!posts || posts.length === 0) return

    const hash = window.location.hash
    if (!hash) return

    const id = hash.substring(1)
    const el = document.getElementById(id)
    if (!el) return

    window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, 0)
  }, [posts])

  return (
    <VStack
      as="ol"
      gap={{ xs: 'space-32', md: 'space-48' }}
      className="agreement-search-results"
      id="agreementSearchResults"
    >
      {posts.map((post) => (
        <VStack
          as="li"
          key={post.nr}
          gap={{ xs: 'space-16', md: 'space-32' }}
          className={'agreement-post spacing-top--small'}
        >
          <HStack gap="space-16" align={'center'}>
            <Heading level="2" size="small" id={`${post.refNr}`} className="agreement-page__post-heading">
              {post.title}
            </Heading>
            <HelpText title={'Om delkontrakten'}>
              <div dangerouslySetInnerHTML={{ __html: post.description }} />
            </HelpText>
          </HStack>
          {post.products.length === 0 && postLoading && (
            <HStack justify="center" style={{ marginTop: '18px' }}>
              <Loader size="medium" title="Laster hjelpemidler" />
            </HStack>
          )}
          {post.products.length === 0 && !postLoading && post.nr !== 99 && (
            <Alert variant="info">Delkontrakten inneholder ingen hjelpemidler</Alert>
          )}
          <HStack gap={'space-16'}>
            {post.products.map((productWithRank) => (
              <ProductCardAgreement
                key={`${productWithRank.product.id} + ${productWithRank.rank}`}
                product={productWithRank.product}
                rank={productWithRank.rank}
                variantCount={productWithRank.variantCount ?? 0}
              />
            ))}
          </HStack>
        </VStack>
      ))}
    </VStack>
  )
}

export default PostsList
