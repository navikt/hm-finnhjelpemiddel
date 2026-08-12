'use client'

import { FeedbackBlock } from '@/app/produkt-test/[id]/FeedbackBlock'
import { OtherProductsOnPost } from '@/app/produkt-test/[id]/OtherProductsOnPost'
import { ProductInfoTest } from '@/app/produkt-test/[id]/ProductInfoTest'
import { VariantTableTest } from '@/app/produkt-test/[id]/variantTable/VariantTableTest'
import { ProductPageLayout } from '@/app/produkt/ProductPageLayout'
import ProductMiddle from '@/app/produkt/[id]/ProductMiddle'
import ProductTop from '@/app/produkt/[id]/ProductTop'
import { VariantTable } from '@/app/produkt/[id]/variantTable/VariantTable'

import { useEffect, useState } from 'react'

import { Box, HStack, Link, VStack } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'
import { logUmamiClickButton } from '@/utils/umami'

import CompareMenu from '@/components/layout/CompareMenu'

export const localStorageProductPageBeta = 'enabledProductPageBeta'
export const ProductTestPage = ({ product }: { product: Product }) => {
  const [betaEnabled, setBetaEnabled] = useState<string | undefined>()

  useEffect(() => {
    setBetaEnabled(localStorage?.getItem(localStorageProductPageBeta) ?? 'false')
  }, [])

  if (betaEnabled === undefined) {
    return <></>
  }

  if (betaEnabled === 'true') {
    return (
      <VStack
        gap={'space-56'}
        paddingBlock={'space-64'}
        //paddingInline={'space-16'}
        marginInline={'auto'}
        marginBlock={'space-0'}
        maxWidth={'1200px'}
      >
        <FeedbackBlock setBetaEnabled={setBetaEnabled} />
        <ProductInfoTest product={product} />
        {<VariantTableTest product={product} />}
        <VStack gap={'space-24'} style={{ gridArea: 'box2' }} paddingInline={'space-32'}>
          {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}
        </VStack>
        <CompareMenu />
      </VStack>
    )
  } else {
    return (
      <ProductPageLayout>
        <Box
          as={VStack}
          gap={'space-24'}
          paddingBlock={'space-12'}
          paddingInline={'space-24'}
          background={'warning-soft'}
          width={{ xs: '100%', sm: '500px' }}
          style={{ alignSelf: 'center' }}
          borderRadius={'8'}
          borderColor={'warning-subtle'}
          borderWidth={'1'}
        >
          <HStack gap={'space-24'} justify={'space-between'}>
            Vil du teste en ny versjon av denne siden?
            <Link
              onClick={() => {
                if (typeof window !== 'undefined') {
                  logUmamiClickButton('Se ny versjon', 'new-product-page-toggle', 'action')
                  localStorage.setItem(localStorageProductPageBeta, 'true')
                  setBetaEnabled('true')
                }
              }}
            >
              Se ny versjon
            </Link>
          </HStack>
        </Box>
        <ProductTop product={product} />
        <ProductMiddle product={product} />
        {product.variants.length > 1 && <VariantTable product={product} />}
      </ProductPageLayout>
    )
  }
}
