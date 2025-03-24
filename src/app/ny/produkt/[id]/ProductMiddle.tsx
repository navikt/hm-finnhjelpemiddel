'use client'

import { BodyShort, Button, Heading, HGrid, VStack } from '@navikt/ds-react'
import { ChevronRightIcon, LayersPlusIcon } from '@navikt/aksel-icons'
import { Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/ny/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/ny/produkt/[id]/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './productmiddle.module.scss'

type Props = {
  product: Product
}

const ProductMiddle = ({ product }: Props) => {
  return (
    <HGrid gap={'8'} columns={2}>
      <VStack gap={'20'} paddingInline={'8'} paddingBlock={'6'}>
        <ProductInformation product={product} />
        {product.variants.length > 1 && (
          <SharedVariantDataTable isoCategory={product.isoCategory} variants={product.variants} />
        )}
      </VStack>
      <VStack gap={'14'} paddingInline={'8'} paddingBlock={'6'} className={styles.boks}>
        <AccessoriesAndParts productName={product.title} accessoriesLink={`/produkt/${product.id}/deler`} />
        {product.agreements.length > 0 && (
          <OtherProductsOnPost
            postName={product.agreements[0].postTitle}
            postLink={`/rammeavtale/hjelpemidler/${product.agreements[0].id}?delkontrakt=${product.agreements[0].postTitle}`}
          />
        )}
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
      <Heading size={'small'} level={'3'}>
        Passer sammen med
      </Heading>
      <BodyShort>Har finner du en liste over tilbehører og reserverveler som passer til {productName}.</BodyShort>
      <Button
        as={NextLink}
        variant={'secondary'}
        icon={<LayersPlusIcon />}
        style={{ width: 'fit-content' }}
        href={accessoriesLink}
      >
        Tilbehør og reservedeler
      </Button>
    </VStack>
  )
}
type OtherProductsOnPostProps = {
  postName: string
  postLink: string
}
const OtherProductsOnPost = ({ postName, postLink }: OtherProductsOnPostProps) => {
  return (
    <VStack gap={'2'}>
      <Heading size={'small'} level={'3'}>
        Andre manuelle rullestoler på delkontrakt {postName}
      </Heading>
      <Button
        as={NextLink}
        variant={'secondary'}
        icon={<ChevronRightIcon />}
        style={{ width: 'fit-content' }}
        href={postLink}
      >
        Flere produkter på delkontrakt
      </Button>
    </VStack>
  )
}
export default ProductMiddle
