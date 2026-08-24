'use client'

import { OtherProductsOnPost } from '@/app/produkt-test/[id]/OtherProductsOnPost'
import { ProductInfoTest } from '@/app/produkt-test/[id]/ProductInfoTest'
import { VariantTableTest } from '@/app/produkt-test/[id]/variantTable/VariantTableTest'

import { VStack } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'

import CompareMenu from '@/components/layout/CompareMenu'

export const ProductTestPage = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  return (
    <VStack
      gap={'space-56'}
      paddingBlock={'space-64'}
      marginInline={'auto'}
      marginBlock={'space-0'}
      maxWidth={'1200px'}
    >
      <ProductInfoTest product={product} hmsartnr={hmsartnr} />
      {<VariantTableTest product={product} />}
      <VStack gap={'space-24'} style={{ gridArea: 'box2' }} paddingInline={'space-32'}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}
      </VStack>
      <CompareMenu />
    </VStack>
  )
}
