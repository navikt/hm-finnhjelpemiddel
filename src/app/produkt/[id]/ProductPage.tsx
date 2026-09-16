'use client'

import { OtherProductsOnPosts } from '@/app/produkt-test/[id]/OtherProductsOnPosts'
import { ProductInfo } from '@/app/produkt/[id]/productInfo/ProductInfo'
import { VariantTable } from '@/app/produkt/[id]/variantTable/VariantTable'

import { VStack } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'
import { TechLabelDTO } from '@/utils/techlabel-util'

import CompareMenu from '@/components/layout/CompareMenu'

export const ProductPage = ({
  product,
  hmsartnr,
  techLabels,
}: {
  product: Product
  hmsartnr?: string
  techLabels: TechLabelDTO[]
}) => {
  return (
    <VStack
      gap={'space-56'}
      paddingBlock={'space-64'}
      marginInline={'auto'}
      marginBlock={'space-0'}
      maxWidth={'1200px'}
    >
      <ProductInfo product={product} hmsartnr={hmsartnr} />
      <VariantTable product={product} techLabels={techLabels} />
      <VStack gap={'space-24'} style={{ gridArea: 'box2' }} paddingInline={'space-32'}>
        {product.agreements.length > 0 && <OtherProductsOnPosts product={product} />}
      </VStack>
      <CompareMenu />
    </VStack>
  )
}
