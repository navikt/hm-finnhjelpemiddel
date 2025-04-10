import { fetchProductsWithVariants, getProductWithVariants } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'
import { Metadata } from 'next'
import ProductTop from '@/app/ny/produkt/[id]/ProductTop'
import ProductMiddle from '@/app/ny/produkt/[id]/ProductMiddle'
import { VStack } from '@navikt/ds-react'
import { VariantTable } from '@/app/ny/produkt/[id]/VariantTable'
import styles from './ProductPage.module.scss'
import AccessoryOrSparePartPage from '@/app/ny/produkt/AccessoryOrSparePartPage'

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
    <div className={styles.container}>
      <VStack gap={'14'} paddingBlock={'16'} maxWidth={'1200px'}>
        <ProductTop product={product} />
        <ProductMiddle product={product} />
        {product.variants.length > 1 && <VariantTable product={product} />}
      </VStack>
    </div>
  )
}
