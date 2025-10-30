'use client'

import { Heading, HGrid, VStack } from '@navikt/ds-react'
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
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}
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

const showOtherProductsOnAgreement = ({ agreement, index }: { agreement: AgreementInfo; index: number }) => {
  return (
    <VStack gap={'2'} paddingBlock={'2 4'} key={index}>
      <NextLink href={`/rammeavtale/hjelpemidler/${agreement.id}#${agreement.refNr}`}>{agreement.postTitle}</NextLink>
    </VStack>
  )
}

const OtherProductsOnPost = ({ agreements }: { agreements: AgreementInfo[] }) => {
  return (
    <VStack gap={'2'} paddingInline={'2 0'}>
      <Heading size={'medium'} level={'2'}>
        Andre produkter på delkontrakt {agreements.map((agreement) => agreement.refNr).join(', ')}:
      </Heading>
      {agreements.length > 0 &&
        agreements.map((agreement, index) => {
          return showOtherProductsOnAgreement({ agreement: agreement, index })
        })}
    </VStack>
  )
}
export default ProductMiddle
