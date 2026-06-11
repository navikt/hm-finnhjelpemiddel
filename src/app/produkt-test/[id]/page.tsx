import { fetchProductsWithVariants, getProductWithVariants } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'
import { Metadata } from 'next'
import AccessoryOrSparePartPage from '@/app/produkt/AccessoryOrSparePartPage'
import { ProductPageLayout } from '@/app/produkt/ProductPageLayout'
import { VariantTableTest } from '@/app/produkt-test/[id]/variantTable/VariantTableTest'
import { ProductInfoTest } from '@/app/produkt-test/[id]/ProductInfoTest'

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
    <ProductPageLayout>
      <ProductInfoTest product={product} />
      {<VariantTableTest product={product} />}
    </ProductPageLayout>
  )
}
