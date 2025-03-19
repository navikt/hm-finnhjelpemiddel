import { Accordion, Heading, VStack } from '@navikt/ds-react'
import { Product } from '@/utils/product-util'
import { GeneralProductInformation } from '@/app/ny/produkt/[id]/GeneralProductInformation'

type ProductInformationProps = {
  product: Product
}
export const ProductInformation = ({ product }: ProductInformationProps) => {
  return (
    <VStack gap={'2'}>
      <Heading size={'small'} level={'3'}>
        Produktinformasjon
      </Heading>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Generell informasjon</Accordion.Header>
          <Accordion.Content>
            <GeneralProductInformation product={product} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Video</Accordion.Header>
          <Accordion.Content>Hei</Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Dokumenter</Accordion.Header>
          <Accordion.Content>png</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </VStack>
  )
}
