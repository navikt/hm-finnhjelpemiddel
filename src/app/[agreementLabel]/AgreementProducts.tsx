'use client'

import { Agreement } from '@/utils/agreement-util'
import { getProductsOnAgreement } from '@/utils/api-util'
import { Product, mapProductWithVariants } from '@/utils/product-util'
import { PostAggregationResponse, ProductSourceResponse } from '@/utils/response-types'
import { Box, Heading, VStack } from '@navikt/ds-react'
// import { getAgreementFromLabel } from '@/utils/api-util
import useSWR from 'swr'

const AgreementProducts = ({ agreement }: { agreement: Agreement }) => {
  const { data, error, isLoading } = useSWR<PostAggregationResponse>(agreement.id, getProductsOnAgreement)

  const posts = data?.aggregations.postNr.buckets

  console.log('agreement', agreement)
  console.log('products', posts)

  const getPostTitle = (postNr: number) => agreement.posts.find((post) => post.nr === postNr)?.title

  return (
    <div>
      {posts?.map((post) => (
        <VStack key={post.key}>
          <Heading level="2" size="medium">
            {getPostTitle(post.key) && getPostTitle(post.key)}
          </Heading>
          {post.seriesId.buckets.map((bucket) => {
            const product = mapProductWithVariants(
              Array(bucket.topHitData.hits.hits[0]._source as ProductSourceResponse)
            )
            return <ProductCard product={product}></ProductCard>
          })}
        </VStack>
      ))}
    </div>
  )
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Box padding="2">
      <Heading level="3" size="small">
        {product.title}
      </Heading>
    </Box>
  )
}

export default AgreementProducts
