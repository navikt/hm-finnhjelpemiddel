import '../../parts-page.scss'
import { PartsPage } from '@/app/deler/PartsPage'
import { mapProductFromSeriesId } from '@/utils/product-util'
import { getProductWithVariants } from '@/utils/api-util'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductPartsPage(props: Props) {
  const params = await props.params
  const title = mapProductFromSeriesId(await getProductWithVariants(params.id)).title
  return params.id && <PartsPage id={params.id} backLink={`/produkt/${params.id}`} isAgreement={false} title={title} />
}
