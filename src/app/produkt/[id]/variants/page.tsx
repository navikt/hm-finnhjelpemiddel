import { getProductWithVariants } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'
import '../../product-page.scss'
import { Heading } from "@navikt/ds-react";
import ProductVariants from "@/app/produkt/variants/ProductVariants";

type Props = {
  params: Promise<{ id: string }>
}

export default async function LargeVariantsPage(props: Props) {
  const params = await props.params;

  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))

  return (
    <div>
      <Heading level="1" size="medium">Varianter</Heading>
      <ProductVariants product={product} />
    </div>
  )
}
