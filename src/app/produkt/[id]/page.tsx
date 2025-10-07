import { fetchProductsWithVariants, getProductWithVariants } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'
import { Metadata } from 'next'
import ProductTop from '@/app/produkt/[id]/ProductTop'
import ProductMiddle from '@/app/produkt/[id]/ProductMiddle'
import { VariantTable } from '@/app/produkt/[id]/variantTable/VariantTable'
import AccessoryOrSparePartPage from '@/app/produkt/AccessoryOrSparePartPage'
import { ProductPageLayout } from '@/app/produkt/ProductPageLayout'

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
      <ProductTop product={product} />
      <ProductMiddle product={product} />
      {product.variants.length > 1 && <VariantTable product={product} />}
    </ProductPageLayout>
  )
}
