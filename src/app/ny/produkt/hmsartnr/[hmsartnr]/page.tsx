import { fetchProductsWithVariants, getProductByHmsartnrWithVariants } from '@/utils/api-util'
import { mapProductFromHmsArtNr } from '@/utils/product-util'
import { Metadata } from 'next'
import styles from '@/app/ny/produkt/[id]/ProductPage.module.scss'
import { VStack } from '@navikt/ds-react'
import ProductTop from '@/app/ny/produkt/[id]/ProductTop'
import ProductMiddle from '@/app/ny/produkt/[id]/ProductMiddle'
import AccessoryOrSparePartPage from '@/app/ny/produkt/AccessoryOrSparePartPage'

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
    <div className={styles.container}>
      <VStack gap={'14'} paddingBlock={'16'} maxWidth={'1200px'}>
        <ProductTop product={product} hmsartnr={params.hmsartnr} />
        <ProductMiddle product={product} hmsartnr={params.hmsartnr} />
      </VStack>
    </div>
  )
}
