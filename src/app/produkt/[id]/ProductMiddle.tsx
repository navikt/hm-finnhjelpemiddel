'use client'

import { Accordion, Button, Chips, Heading, HGrid, VStack } from '@navikt/ds-react'
import { AgreementInfo, Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/produkt/[id]/variantTable/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './ProductMiddle.module.scss'
import { VariantTableSingle } from '@/app/produkt/[id]/variantTable/VariantTableSingle'
import { fetchProductsWithVariants } from '@/utils/api-util'
import { ProductCardWorksWith } from '@/app/produkt/[id]/ProductCardWorksWith'

import { useEffect, useMemo, useState } from 'react'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'

const PRODUCTS_PER_PAGE = 5

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
  const featureFlags = useFeatureFlags()

  const worksWithFeatureFlag: boolean = featureFlags.isEnabled('finnhjelpemiddel.vis-virker-sammen-med-products') ?? false

  const worksWithAgreementIds = ['7ef2ab32-34bd-4eec-92a8-2b5c47b77c78', '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96']
  const worksWithAgreementTitles = ['Varslingshjelpemidler', 'Hørselshjelpemidler']

  const shouldShowWorksWithSection = useMemo(() => {
    const agreementIds = product.agreements.map((agreement) => agreement.id)
    const agreementTitles = product.agreements.map((agreement) => agreement.title)

    const hasMatchingId = agreementIds.some((id) => worksWithAgreementIds.includes(id))
    const hasMatchingTitle = agreementTitles.some((title) => worksWithAgreementTitles.includes(title))

    return hasMatchingId || hasMatchingTitle
  }, [product.agreements])


  return (
    <HGrid gap={'20 8'} columns={{ sm: 1, md: 2 }} className={styles.middleContainer} paddingBlock={'6 0'}>
      <div style={{ gridArea: 'box1' }}>
        <ProductInformation product={product} />
      </div>
      <VStack gap={'6'} style={{ gridArea: 'box2' }}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}

        {worksWithFeatureFlag && shouldShowWorksWithSection && workWithProducts && workWithProducts.length > 0 && (
          <Accordion size={'small'}>
            <Accordion.Item defaultOpen className={styles.accordionLast}>
              <Accordion.Header className={styles.accordion}>Virker sammen med</Accordion.Header>
              <Accordion.Content>
                <WorksWithSection products={workWithProducts} />
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
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

const ComponentTypeFilter = ({
  componentTypes,
  selectedTypes,
  onToggle,
}: {
  componentTypes: string[]
  selectedTypes: string[]
  onToggle: (type: string) => void
}) => {
  if (componentTypes.length <= 1) {
    return null
  }

  return (
    <VStack gap={'2'}>
      <Chips>
        {componentTypes.map((type) => (
          <Chips.Toggle key={type} selected={selectedTypes.includes(type)} onClick={() => onToggle(type)}>
            {type}
          </Chips.Toggle>
        ))}
      </Chips>
    </VStack>
  )
}

const WorksWithSection = ({ products }: { products: Product[] }) => {
  const [selectedComponentTypes, setSelectedComponentTypes] = useState<string[]>([])
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE)

  useEffect(() => {
    setDisplayCount(PRODUCTS_PER_PAGE)
  }, [selectedComponentTypes])


  const componentTypes = useMemo(() => {
    const types = products
      .flatMap((product) => product.variants.map((variant) => variant.techData?.Komponenttype?.value))
      .filter((type): type is string => type !== undefined && type !== '')

    return [...new Set(types)]
  }, [products])

  const filteredProducts = useMemo(() => {
    if (selectedComponentTypes.length === 0) {
      return products
    }

    return products.filter((product) =>
      product.variants.some((variant) => {
        const variantType = variant.techData?.Komponenttype?.value
        return variantType && selectedComponentTypes.includes(variantType)
      })
    )
  }, [products, selectedComponentTypes])


  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount)
  }, [filteredProducts, displayCount])

  const hasMoreProducts = displayCount < filteredProducts.length

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + PRODUCTS_PER_PAGE)
  }

  const handleComponentTypeToggle = (type: string) => {
    setSelectedComponentTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  return (
    <VStack gap={'4'}>
      <ComponentTypeFilter
        componentTypes={componentTypes}
        selectedTypes={selectedComponentTypes}
        onToggle={handleComponentTypeToggle}
      />

      {displayedProducts.map((workWithProduct: Product) => (
        <ProductCardWorksWith key={workWithProduct.id} product={workWithProduct} />
      ))}

      {filteredProducts.length === 0 && <p>Ingen produkter matcher valgt filter.</p>}

      {hasMoreProducts && (
        <Button className={styles.buttonLoadMore} variant="secondary" size="medium" onClick={handleLoadMore}>
          Vis flere produkter ({filteredProducts.length - displayCount} gjenstående)
        </Button>
      )}
    </VStack>
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
