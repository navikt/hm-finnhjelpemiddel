'use client'

import { BodyShort, Button, Heading, HGrid, VStack } from '@navikt/ds-react'
import { ChevronRightIcon, LayersPlusIcon } from '@navikt/aksel-icons'
import { AgreementInfo, Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/ny/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/ny/produkt/[id]/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './productmiddle.module.scss'
import { VariantTable } from '@/app/ny/produkt/[id]/VariantTable'

type Props = {
  product: Product
}

const ProductMiddle = ({ product }: Props) => {
  return (
    <HGrid gap={'8'} columns={2}>
      <VStack gap={'20'} paddingBlock={'6 0'}>
        <ProductInformation product={product} />
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
      </VStack>
      <VStack gap={'14'} paddingInline={'8'} paddingBlock={'6'} className={styles.boks}>
        <AccessoriesAndParts productName={product.title} accessoriesLink={`/produkt/${product.id}/deler`} />
        {product.agreements.length > 0 && <OtherProductsOnPost agreement={product.agreements[0]} />}
      </VStack>
    </HGrid>
  )
}

type AccessoriesAndPartsProps = {
  productName: string
  accessoriesLink: string
}
const AccessoriesAndParts = ({ productName, accessoriesLink }: AccessoriesAndPartsProps) => {
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
        href={accessoriesLink}
      >
        Tilbehør og reservedeler
      </Button>
    </VStack>
  )
}
type OtherProductsOnPostProps = {
  agreement: AgreementInfo
}
const OtherProductsOnPost = ({ agreement }: OtherProductsOnPostProps) => {
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
