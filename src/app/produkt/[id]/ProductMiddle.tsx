'use client'

import { Accordion, Heading, HGrid, VStack } from '@navikt/ds-react'
import { AgreementInfo, Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/produkt/[id]/variantTable/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './ProductMiddle.module.scss'
import { VariantTableSingle } from '@/app/produkt/[id]/variantTable/VariantTableSingle'
import { fetchProductsWithVariants } from '@/utils/api-util'
import { ProductCardWorksWith } from '@/app/produkt/[id]/ProductCardWorksWith'

import { useEffect, useState } from 'react'

const ProductMiddle = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  const [workWithProducts, setWorkWithProducts] = useState<Product[]>([])
  const worksWithSeriesIds = product.attributes.worksWith?.seriesIds
  useEffect(() => {
    const fetchData = async () => {
      const products = (worksWithSeriesIds && (await fetchProductsWithVariants(worksWithSeriesIds)).products) || []
      setWorkWithProducts(products)
    }
    fetchData()
  }, [worksWithSeriesIds])

  const agreementIds = product.agreements.map((agreement) => agreement.id)
  const agreementTitles = product.agreements.map((agreement) => agreement.title)
  const worksWithAgreementId = ['7ef2ab32-34bd-4eec-92a8-2b5c47b77c78', '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96']
  const worksWithAgreementTitle = ['Varslingshjelpemidler', 'Hørselshjelpemidler']

  return (
    <HGrid gap={'20 8'} columns={{ sm: 1, md: 2 }} className={styles.middleContainer} paddingBlock={'6 0'}>
      <div style={{ gridArea: 'box1' }}>
        <ProductInformation product={product} />
      </div>
      <VStack gap={'6'} style={{ gridArea: 'box2' }}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}

        {workWithProducts && workWithProducts.length > 0 && (
          /*          (agreementIds.some(agreementId => agreementId in worksWithAgreementId) ||
          agreementTitles.some(agreementTitle => agreementTitle in worksWithAgreementTitle)) &&*/
          <>
            <Accordion headingSize={'small'}>
              <Accordion.Item defaultOpen>
                <Accordion.Header className={styles.accordion}>Virker sammen med</Accordion.Header>
                <Accordion.Content>
                  {workWithProducts.map((workWithProduct: Product, index) => (
                    <ProductCardWorksWith key={workWithProduct.id} product={workWithProduct} />
                  ))}
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </>
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
