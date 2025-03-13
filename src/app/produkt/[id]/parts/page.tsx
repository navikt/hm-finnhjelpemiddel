import { getProductWithVariants } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'
import '../../product-page.scss'
import { Heading } from '@navikt/ds-react'
import { VariantView } from '@/app/produkt/variants/VariantView'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PartsPage(props: Props) {
  const params = await props.params

  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))

  return (
    <div>
      <Heading level="1" size="medium">
        Varianter
      </Heading>
      <VariantView product={product} />
    </div>
  )
}
