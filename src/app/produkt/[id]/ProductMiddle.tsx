'use client'

import { Heading, HGrid, VStack } from '@navikt/ds-react'
import { AgreementInfo, Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/produkt/[id]/variantTable/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './ProductMiddle.module.scss'
import { VariantTableSingle } from '@/app/produkt/[id]/variantTable/VariantTableSingle'
import useSWR, { useSWRConfig } from 'swr'
import { fetchCompatibleProducts, fetchWorkWithProducts } from '@/utils/api-util'

const ProductMiddle = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
/*  const { data: worksWithProducts } = useSWR(['worksWith', product.id], () => fetchWorkWithProducts(product.id), { keepPreviousData: true })*/
/*  const { data: worksWithProducts } = useSWR(product.id, fetchWorkWithProducts, { keepPreviousData: true })*/
  const { mutate } = useSWRConfig();
    const { data: worksWithProducts} = useSWR(['worksWith', product.id], () => fetchWorkWithProducts(product.id), { keepPreviousData: true })
  console.debug(product.id)
  console.debug(worksWithProducts)

  return (
    <HGrid gap={'20 8'} columns={{ sm: 1, md: 2 }} className={styles.middleContainer} paddingBlock={'6 0'}>
      <div style={{ gridArea: 'box1' }}>
        <ProductInformation product={product} />
      </div>
      <VStack gap={'6'} style={{ gridArea: 'box2' }}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}
        {worksWithProducts && worksWithProducts.length > 0 && (
          `${worksWithProducts.length} produkter fungerer sammen med er:` +

          {/*        {worksWithProducts?.map((p) =>
              <ProductCard type={'plain'} product={p} key={p.id />
        }*/}
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

const showOtherProductsOnAgreement = ({ agreement, index }: { agreement: AgreementInfo; index: number }) => {
  return (
    <VStack gap={'2'} paddingBlock={'2 4'} key={index}>
      <NextLink href={`/rammeavtale/hjelpemidler/${agreement.id}#${agreement.refNr}`}>{agreement.postTitle}</NextLink>
    </VStack>
  )
}

const OtherProductsOnPost = ({ agreements }: { agreements: AgreementInfo[] }) => {
  const sortedAgreements = [...agreements].sort((a, b) => {
    return b.postNr !== a.postNr ? a.postNr - b.postNr : !a.refNr ? -1 : !b.refNr ? 1 : b.refNr.localeCompare(a.refNr)
  })

  return (
    <VStack gap={'2'} paddingInline={'2 0'}>
      <Heading size={'medium'} level={'2'}>
        Andre hjelpemidler på delkontrakt:
      </Heading>
      {sortedAgreements.length > 0 &&
        sortedAgreements.map((agreement, index) => {
          return showOtherProductsOnAgreement({ agreement: agreement, index })
        })}
    </VStack>
  )
}
export default ProductMiddle
