import { Accordion, Heading, VStack } from '@navikt/ds-react'
import { Product } from '@/utils/product-util'
import { GeneralProductInformation } from '@/app/produkt/[id]/GeneralProductInformation'
import { Videos } from '@/app/produkt/[id]/Videos'
import { Documents } from '@/app/produkt/[id]/Documents'
import styles from './ProductInformation.module.scss'
import { useState } from 'react'

export const ProductInformation = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <VStack gap={"space-8"}>
      <Heading size={'medium'} level={'2'}>
        Produktinformasjon
      </Heading>
      <Accordion headingSize={'small'}>
        <Accordion.Item defaultOpen>
          <Accordion.Header className={styles.accordion}>Generell informasjon</Accordion.Header>
          <Accordion.Content>
            <GeneralProductInformation product={product} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header className={styles.accordion}>Video</Accordion.Header>
          <Accordion.Content>
            <Videos videos={product.videos} />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item className={styles.accordionLast} onOpenChange={() => setOpen(!open)}>
          <Accordion.Header className={open ? styles.accordion : styles.accordionLast}>Dokumenter</Accordion.Header>
          <Accordion.Content>
            <Documents documents={product.documents} documentUrls={product.attributes.documentUrls ?? []} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </VStack>
  );
}
