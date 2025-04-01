'use client'

import { BodyShort, Button, Heading, HGrid, VStack } from '@navikt/ds-react'
import { ChevronRightIcon, LayersPlusIcon } from '@navikt/aksel-icons'
import { AgreementInfo, Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/ny/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/ny/produkt/[id]/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './productmiddle.module.scss'
import { VariantTable } from '@/app/ny/produkt/[id]/VariantTable'

const ProductMiddle = ({ product }: { product: Product }) => {
  return (
    <HGrid gap={'20 8'} columns={{ sm: 1, md: 2 }} className={styles.middleContainer} paddingBlock={'6 0'}>
      <div style={{ gridArea: 'box1' }}>
        <ProductInformation product={product} />
      </div>
      <VStack gap={'14'} paddingInline={'8'} paddingBlock={'6'} className={styles.boks} style={{ gridArea: 'box2' }}>
        <AccessoriesAndParts productName={product.title} productId={product.id} />
        {product.agreements.length > 0 && <OtherProductsOnPost agreement={product.agreements[0]} />}
      </VStack>
      <div style={{ gridArea: 'box3' }}>
        {product.variants.length > 1 && (
          <SharedVariantDataTable isoCategory={product.isoCategory} variants={product.variants} />
        )}
        {product.variants.length === 1 && (
          <div>
            <Heading level="2" size="medium">
              Egenskaper
            </Heading>
            <VariantTable product={product} />{' '}
          </div>
        )}
      </div>
    </HGrid>
  )
}

const AccessoriesAndParts = ({ productName, productId }: { productName: string; productId: string }) => {
  return (
    <VStack gap={'2'}>
      <Heading size={'medium'} level={'2'}>
        Passer sammen med
      </Heading>
      <BodyShort>Her finner du en liste over tilbehør og reservedeler som passer til {productName}.</BodyShort>
      <Button
        className={styles.button}
        as={NextLink}
        variant={'secondary'}
        icon={<LayersPlusIcon aria-hidden />}
        href={`/produkt/${productId}/deler`}
      >
        Tilbehør og reservedeler
      </Button>
    </VStack>
  )
}

const OtherProductsOnPost = ({ agreement }: { agreement: AgreementInfo }) => {
  return (
    <VStack gap={'2'}>
      <Heading size={'medium'} level={'2'}>
        Andre produkter på delkontrakt {agreement.postNr}
      </Heading>
      <BodyShort>{agreement.postTitle}</BodyShort>
      <Button
        className={styles.button}
        as={NextLink}
        variant={'secondary'}
        icon={<ChevronRightIcon aria-hidden />}
        href={`/rammeavtale/hjelpemidler/${agreement.id}?delkontrakt=${agreement.postTitle}`}
      >
        Flere produkter på delkontrakt
      </Button>
    </VStack>
  )
}
export default ProductMiddle
