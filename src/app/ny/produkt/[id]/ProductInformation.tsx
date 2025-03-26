import { Accordion, Heading, VStack } from '@navikt/ds-react'
import { Product } from '@/utils/product-util'
import { GeneralProductInformation } from '@/app/ny/produkt/[id]/GeneralProductInformation'
import { Documents } from '@/app/produkt/[id]/Documents'
import { Videos } from '@/app/ny/produkt/[id]/Videos'

type ProductInformationProps = {
  product: Product
}
export const ProductInformation = ({ product }: ProductInformationProps) => {
  return (
    <VStack gap={'2'}>
      <Heading size={'medium'} level={'2'}>
        Produktinformasjon
      </Heading>
      <Accordion headingSize={'small'}>
        <Accordion.Item>
          <Accordion.Header>Generell informasjon</Accordion.Header>
          <Accordion.Content>
            <GeneralProductInformation product={product} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Video</Accordion.Header>
          <Accordion.Content>
            <Videos videos={product.videos} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Dokumenter</Accordion.Header>
          <Accordion.Content>
            <Documents documents={product.documents} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </VStack>
  )
}
