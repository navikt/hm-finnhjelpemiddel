import { getProductWithVariants } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'
import { ProductPageLayout } from '@/app/produkt/ProductPageLayout'
import { Accordion, BodyLong, BodyShort, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { HackathonLayout } from '@/app/hackathon/[id]/HackathonLayout'
import { Problem } from '@/app/hackathon/[id]/problem/Problem'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProduktPage(props: Props) {
  const params = await props.params

  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))

  return (
    <HackathonLayout>
      <Problem product={product} />
    </HackathonLayout>
  )
}
