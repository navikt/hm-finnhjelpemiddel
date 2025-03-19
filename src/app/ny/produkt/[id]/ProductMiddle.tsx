'use client'

import { Bleed, BodyShort, Button, Heading, HGrid, VStack } from '@navikt/ds-react'
import { ChevronRightIcon, LayersPlusIcon } from '@navikt/aksel-icons'
import styles from './productmiddle.module.scss'
import { Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/ny/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/ny/produkt/[id]/SharedVariantDataTable'

type Props = {
  product: Product
}

const ProductMiddle = ({ product }: Props) => {
  return (
    <Bleed reflectivePadding marginInline="full" className={styles.middleContainer}>
      <HGrid gap={'8'} columns={2}>
        <VStack gap={'4'}>
          <ProductInformation product={product} />
          <SharedVariantDataTable isoCategory={product.isoCategory} variants={product.variants} />
        </VStack>
        <VStack gap={'4'}>
          <AccessoriesAndParts productName={product.title} accessoriesLink={'testaccessories'} />
          {product.agreements.length > 0 && (
            <OtherProductsOnPost postName={product.agreements[0].postTitle} postLink={'testpost'} />
          )}
        </VStack>
      </HGrid>
    </Bleed>
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
      <Button variant={'secondary'} icon={<LayersPlusIcon />} style={{ width: 'fit-content' }}>
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
      <Button variant={'secondary'} icon={<ChevronRightIcon />} style={{ width: 'fit-content' }}>
        Flere produkter på delkontrakt
      </Button>
    </VStack>
  )
}
export default ProductMiddle
