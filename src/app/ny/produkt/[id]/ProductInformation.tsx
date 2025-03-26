import { Accordion, Heading, VStack } from '@navikt/ds-react'
import { Product } from '@/utils/product-util'
import { GeneralProductInformation } from '@/app/ny/produkt/[id]/GeneralProductInformation'
import { Videos } from '@/app/ny/produkt/[id]/Videos'
import { Documents } from '@/app/ny/produkt/[id]/Documents'

export const ProductInformation = ({ product }: { product: Product }) => {
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
