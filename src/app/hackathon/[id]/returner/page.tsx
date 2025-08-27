import { getProductWithVariants } from '@/utils/api-util'
import { mapProductFromSeriesId } from '@/utils/product-util'
import { ProductPageLayout } from '@/app/produkt/ProductPageLayout'
import { BodyLong, BodyShort, Button, Heading, VStack } from '@navikt/ds-react'
import { HackathonLayout } from '@/app/hackathon/[id]/HackathonLayout'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProduktPage(props: Props) {
  const params = await props.params

  const product = mapProductFromSeriesId(await getProductWithVariants(params.id))

  return (
    <HackathonLayout>
      <VStack gap={'8'} style={{ maxWidth: '600px' }}>
        <Heading size={'large'}>Returner {product.title}</Heading>
        <BodyLong>
          Dersom du ikke lenger har behov for dette hjelpemiddelet kan du enkelt returnere det selv ved å levere det på
          kommunalt hjelpemiddellager.
        </BodyLong>

        <VStack gap={'6'}>
          <Heading size={'large'}>Hjelpemiddellageret</Heading>
          <VStack gap={'2'}>
            <BodyShort>Bedriftsveien 10</BodyShort>
            <BodyShort>6517 Kristiansund</BodyShort>
          </VStack>
          <VStack gap={'2'}>
            <BodyShort>Tlf: 35232342</BodyShort>
            <BodyShort>Åpningstider: Man - fre 08:00 - 16:00</BodyShort>
          </VStack>

          <BodyLong>
            Hvis du har behov for at hjelpemiddelet skal hentes kan du kontakte Kristiansund kommune for å avtale
            henting gjennom skjema her.
          </BodyLong>
        </VStack>

        <Button variant={'secondary'} style={{ width: 'fit-content' }}>
          Send henteskjema
        </Button>
      </VStack>
    </HackathonLayout>
  )
}
