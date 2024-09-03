
import { getProductWithVariants } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'
import '.././product-page.scss'
import ProductVariants from "@/app/produkt/[id]/ProductVariants";

type Props = {
  params: { id: string }
}

export default async function LargeVariantsPage({ params }: Props) {

  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))

  return (
    <div>
      <ProductVariants product={product} />
    </div>
  )
}
