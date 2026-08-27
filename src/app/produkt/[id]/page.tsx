import { ProductTestPage } from '@/app/produkt-test/[id]/ProductTestPage'
import AccessoryOrSparePartPage from '@/app/produkt/AccessoryOrSparePartPage'

import { Metadata } from 'next'

import { fetchProductsWithVariants, getProductWithVariants, getTechLabels } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'

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

  const matchingProductsPromise = matchingSeriesIds
    ? fetchProductsWithVariants(matchingSeriesIds).then((res) => res.products)
    : Promise.resolve([])
  const techLabelsPromise = isAccessoryOrSparePart ? Promise.resolve([]) : getTechLabels(product.isoCategory)

  const [matchingProducts, techLabels] = await Promise.all([matchingProductsPromise, techLabelsPromise])

  return isAccessoryOrSparePart ? (
    <AccessoryOrSparePartPage product={product} matchingProducts={matchingProducts} />
  ) : (
    <ProductTestPage product={product} techLabels={techLabels} />
  )
}
