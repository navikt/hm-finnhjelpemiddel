'use client'

import { BodyShort, Button, Heading, HGrid, VStack } from '@navikt/ds-react'
import { ChevronRightIcon, LayersPlusIcon } from '@navikt/aksel-icons'
import { AgreementInfo, Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/produkt/[id]/variantTable/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './ProductMiddle.module.scss'
import { VariantTableSingle } from '@/app/produkt/[id]/variantTable/VariantTableSingle'
import useSWR from 'swr'
import { fetchCompatibleProducts } from '@/utils/api-util'

const ProductMiddle = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  const { data: compatibleWithProducts } = useSWR(product.id, fetchCompatibleProducts, { keepPreviousData: true })

  return (
    <HGrid gap={'20 8'} columns={{ sm: 1, md: 2 }} className={styles.middleContainer} paddingBlock={'6 0'}>
      <div style={{ gridArea: 'box1' }}>
        <ProductInformation product={product} />
      </div>
      <VStack gap={'6'} style={{ gridArea: 'box2' }}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreement={product.agreements[0]} />}
        {compatibleWithProducts && compatibleWithProducts.length > 0 && (
          <AccessoriesAndParts
            productName={hmsartnr ? `serien ${product.title}` : product.title}
            productId={product.id}
          />
        )}
      </VStack>
      <div style={{ gridArea: 'box3' }}>
        <>
          {product.variants.length > 1 && (
            <SharedVariantDataTable isoCategory={product.isoCategory} variants={product.variants} />
          )}
          {product.variants.length === 1 && <VariantTableSingle product={product} />}
        </>
      </div>
    </HGrid>
  )
}

const AccessoriesAndParts = ({ productName, productId }: { productName: string; productId: string }) => {
  return (
    <VStack gap={'2'} paddingInline={'8'} paddingBlock={'6 8'} className={styles.boks}>
      <Heading size={'medium'} level={'2'}>
        Passer sammen med
      </Heading>
      <VStack gap={'6'}>
        <BodyShort>Her finner du en liste over tilbehør og reservedeler som passer til {productName}.</BodyShort>
        <Button
          className={styles.button}
          as={NextLink}
          variant={'primary'}
          icon={<LayersPlusIcon aria-hidden />}
          href={`/produkt/${productId}/deler`}
        >
          Tilbehør og reservedeler
        </Button>
      </VStack>
    </VStack>
  )
}

const OtherProductsOnPost = ({ agreement }: { agreement: AgreementInfo }) => {
  return (
    <VStack gap={'2'} paddingInline={'8'} paddingBlock={'6 8'} className={styles.boks}>
      <Heading size={'medium'} level={'2'}>
        Andre produkter på delkontrakt {agreement.refNr}
      </Heading>
      <VStack gap={'6'}>
        <BodyShort>{agreement.postTitle}</BodyShort>
        <Button
          className={styles.button}
          as={NextLink}
          variant={'secondary'}
          icon={<ChevronRightIcon aria-hidden />}
          // & for å bevare trailing space som har kommet med noen delkontrakter, blir strippa bort natively (?), dum filtrering tar ikke hensyn til det
          href={`/rammeavtale/hjelpemidler/${agreement.id}?delkontrakt=${agreement.postTitle}&`}
        >
          Flere produkter på delkontrakt
        </Button>
      </VStack>
    </VStack>
  )
}
export default ProductMiddle
