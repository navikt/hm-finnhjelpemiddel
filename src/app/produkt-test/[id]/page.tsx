import { fetchProductsWithVariants, getProductWithVariants } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'
import { Metadata } from 'next'
import AccessoryOrSparePartPage from '@/app/produkt/AccessoryOrSparePartPage'
import { VariantTableTest } from '@/app/produkt-test/[id]/variantTable/VariantTableTest'
import { ProductInfoTest } from '@/app/produkt-test/[id]/ProductInfoTest'
import { VStack } from '@navikt/ds-react'

import { OtherProductsOnPost } from '@/app/produkt-test/[id]/OtherProductsOnPost'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))

  return {
    title: product.title,
    description: 'Produktside for ' + product.title,
  }
}

export default async function ProduktPage(props: Props) {
  const params = await props.params

  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))
  const isAccessoryOrSparePart = !product.main
  const matchingSeriesIds = product.attributes.compatibleWith?.seriesIds

  const matchingProducts = (matchingSeriesIds && (await fetchProductsWithVariants(matchingSeriesIds)).products) || []

  return isAccessoryOrSparePart ? (
    <AccessoryOrSparePartPage product={product} matchingProducts={matchingProducts} />
  ) : (
    <VStack
      gap={'space-56'}
      paddingBlock={'space-64'}
      //paddingInline={'space-16'}
      marginInline={'auto'}
      marginBlock={'space-0'}
      maxWidth={'1200px'}
    >
      <ProductInfoTest product={product} />
      {<VariantTableTest product={product} />}
      <VStack gap={'space-24'} style={{ gridArea: 'box2' }} paddingInline={'space-32'}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}
      </VStack>
    </VStack>
  )
}
