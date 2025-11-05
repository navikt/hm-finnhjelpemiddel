'use client'

import { Accordion, Chips, Heading, HGrid, VStack } from '@navikt/ds-react'
import { AgreementInfo, Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/produkt/[id]/variantTable/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './ProductMiddle.module.scss'
import { VariantTableSingle } from '@/app/produkt/[id]/variantTable/VariantTableSingle'
import { fetchProductsWithVariants } from '@/utils/api-util'
import { ProductCardWorksWith } from '@/app/produkt/[id]/ProductCardWorksWith'

import { useEffect, useMemo, useState } from 'react'


const ProductMiddle = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  const [workWithProducts, setWorkWithProducts] = useState<Product[]>([])
  const [selectedComponentTypes, setSelectedComponentTypes] = useState<string[]>([])
  const worksWithSeriesIds = product.attributes.worksWith?.seriesIds

  useEffect(() => {
    const fetchData = async () => {
      const products = (worksWithSeriesIds && (await fetchProductsWithVariants(worksWithSeriesIds)).products) || []
      setWorkWithProducts(products)
    }
    fetchData()
  }, [worksWithSeriesIds])

  const componentTypes = useMemo(() => {
    const types = workWithProducts.flatMap(product =>
      product.variants.map(variant => variant.techData?.Komponenttype?.value)
    ).filter((type): type is string => type !== undefined && type !== '')

    return [...new Set(types)]
  }, [workWithProducts])

  const filteredWorkWithProducts = useMemo(() => {
    if (selectedComponentTypes.length === 0) {
      return workWithProducts
    }

    return workWithProducts.filter(product =>
      product.variants.some(variant => {
        const variantType = variant.techData?.Komponenttype?.value
        return variantType && selectedComponentTypes.includes(variantType)
      })
    )
  }, [workWithProducts, selectedComponentTypes])

  const handleComponentTypeToggle = (type: string) => {
    setSelectedComponentTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }
  const agreementIds = product.agreements.map((agreement) => agreement.id)
  const agreementTitles = product.agreements.map((agreement) => agreement.title)
  const worksWithAgreementId = ['7ef2ab32-34bd-4eec-92a8-2b5c47b77c78', '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96']
  const worksWithAgreementTitle = ['Varslingshjelpemidler', 'Hørselshjelpemidler']

  console.log('componentTypes', componentTypes)
  console.log('selectedComponentTypes', selectedComponentTypes)
  console.log('filteredWorkWithProducts', filteredWorkWithProducts)


  return (
    <HGrid gap={'20 8'} columns={{ sm: 1, md: 2 }} className={styles.middleContainer} paddingBlock={'6 0'}>
      <div style={{ gridArea: 'box1' }}>
        <ProductInformation product={product} />
      </div>
      <VStack gap={'6'} style={{ gridArea: 'box2' }}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}

        {workWithProducts && workWithProducts.length > 0 && (
          <>
            <Accordion size={'small'}>
              <Accordion.Item defaultOpen>
                <Accordion.Header className={styles.accordion}>Virker sammen med</Accordion.Header>
                <Accordion.Content>
                  <>
                    {componentTypes.length > 1 && (
                      <VStack gap={'4'} paddingBlock={'0 4'}>
                        <Chips>
                          {componentTypes.map((type) => (
                            <Chips.Toggle
                              key={type}
                              selected={selectedComponentTypes.includes(type)}
                              onClick={() => handleComponentTypeToggle(type)}
                            >
                              {type}
                            </Chips.Toggle>
                          ))}
                        </Chips>
                      </VStack>
                    )}
                    {filteredWorkWithProducts.map((workWithProduct: Product) => (
                      <ProductCardWorksWith key={workWithProduct.id} product={workWithProduct} />
                    ))}

                    {filteredWorkWithProducts.length === 0 && (
                      <p>Ingen produkter matcher valgt filter.</p>
                    )}
                  </>
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
