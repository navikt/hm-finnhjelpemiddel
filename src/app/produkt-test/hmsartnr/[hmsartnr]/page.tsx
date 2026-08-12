import { ProductTestPage } from '@/app/produkt-test/[id]/ProductTestPage'
import AccessoryOrSparePartPage from '@/app/produkt/AccessoryOrSparePartPage'

import { Metadata } from 'next'

import { fetchProductsWithVariants, getProductByHmsartnrWithVariants } from '@/utils/api-util'
import { mapProductFromHmsArtNr } from '@/utils/product-util'

type Props = {
  params: Promise<{ hmsartnr: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const product = mapProductFromHmsArtNr(await getProductByHmsartnrWithVariants(params.hmsartnr), params.hmsartnr)

  return {
    title: product.title,
    description: 'Produktside for ' + product.title,
  }
}

export default async function ProduktPage(props: Props) {
  const params = await props.params

  const product = mapProductFromHmsArtNr(await getProductByHmsartnrWithVariants(params.hmsartnr), params.hmsartnr)
  const isAccessoryOrSparePart = !product.main
  const matchingSeriesIds = product.attributes.compatibleWith?.seriesIds

  const matchingProducts = (matchingSeriesIds && (await fetchProductsWithVariants(matchingSeriesIds)).products) || []

  return isAccessoryOrSparePart ? (
    <AccessoryOrSparePartPage product={product} matchingProducts={matchingProducts} />
  ) : (
    <ProductTestPage product={product} hmsartnr={params.hmsartnr} />
  )
}
