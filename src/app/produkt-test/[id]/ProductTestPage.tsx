'use client'

import { Product } from '@/utils/product-util'
import { VStack } from '@navikt/ds-react'
import { ProductInfoTest } from '@/app/produkt-test/[id]/ProductInfoTest'
import { VariantTableTest } from '@/app/produkt-test/[id]/variantTable/VariantTableTest'
import { OtherProductsOnPost } from '@/app/produkt-test/[id]/OtherProductsOnPost'
import { FeedbackBlock } from '@/app/produkt-test/[id]/FeedbackBlock'

export const ProductTestPage = ({ product }: { product: Product }) => {
  return (
    <VStack
      gap={'space-56'}
      paddingBlock={'space-64'}
      //paddingInline={'space-16'}
      marginInline={'auto'}
      marginBlock={'space-0'}
      maxWidth={'1200px'}
    >
      <FeedbackBlock />
      <ProductInfoTest product={product} />
      {<VariantTableTest product={product} />}
      <VStack gap={'space-24'} style={{ gridArea: 'box2' }} paddingInline={'space-32'}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}
      </VStack>
    </VStack>
  )
}
