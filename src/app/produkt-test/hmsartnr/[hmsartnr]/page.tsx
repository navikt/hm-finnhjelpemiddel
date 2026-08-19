import { redirect } from 'next/navigation'

import { getProductByHmsartnrWithVariants } from '@/utils/api-util'
import { mapProductFromHmsArtNr } from '@/utils/product-util'

type Props = {
  params: Promise<{ hmsartnr: string }>
}

export default async function ProduktPage(props: Props) {
  const params = await props.params

  const product = mapProductFromHmsArtNr(await getProductByHmsartnrWithVariants(params.hmsartnr), params.hmsartnr)
  redirect(`/produkt-test/${product.id}?term=${params.hmsartnr}`)
}
