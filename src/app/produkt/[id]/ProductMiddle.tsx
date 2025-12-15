'use client'

import {
  Accordion,
  BodyLong,
  BodyShort,
  Button,
  Chips,
  Heading,
  HelpText,
  HGrid,
  HStack,
  VStack,
} from '@navikt/ds-react'
import { AgreementInfo, Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/produkt/[id]/ProductInformation'
import { SharedVariantDataTable } from '@/app/produkt/[id]/variantTable/SharedVariantDataTable'
import NextLink from 'next/link'
import styles from './ProductMiddle.module.scss'
import { VariantTableSingle } from '@/app/produkt/[id]/variantTable/VariantTableSingle'
import { FetchSeriesResponse, fetchWorkWithProducts } from '@/utils/api-util'
import { ProductCardWorksWith } from '@/app/produkt/[id]/ProductCardWorksWith'

import { useEffect, useMemo, useState } from 'react'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { logUmamiClickButton, logUmamiFilterChangeEvent } from '@/utils/umami'
import { ChevronDownIcon } from '@navikt/aksel-icons'
import useSWRImmutable from 'swr/immutable'

const WORKS_WITH_CONFIG = {
  featureFlag: 'finnhjelpemiddel.vis-virker-sammen-med-products',
  agreementIds: new Set(['7ef2ab32-34bd-4eec-92a8-2b5c47b77c78', '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96']),
  agreementTitles: new Set(['Varslingshjelpemidler', 'Hørselshjelpemidler']),
  productsPerPage: 5,
}

const ProductMiddle = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  const [open, setOpen] = useState<boolean>(false)
  const worksWithSeriesIds = product.attributes.worksWith?.seriesIds

  const { data } = useSWRImmutable<FetchSeriesResponse>(worksWithSeriesIds, fetchWorkWithProducts)
  const worksWithProducts = data?.products

  const featureFlags = useFeatureFlags()

  const worksWithFeatureFlag: boolean = featureFlags.isEnabled(WORKS_WITH_CONFIG.featureFlag) ?? false

  const shouldShowSection = useMemo(() => {
    return product.agreements.some(
      (agreement) =>
        WORKS_WITH_CONFIG.agreementIds.has(agreement.id) || WORKS_WITH_CONFIG.agreementTitles.has(agreement.title)
    )
  }, [product.agreements])

  const worksWithShowConstrain =
    worksWithFeatureFlag && shouldShowSection && worksWithProducts && worksWithProducts.length > 0
  const helpTextWorksWith = (
    <BodyLong>
      Hjelpemiddelet virker sammen med disse opplistede hjelpemidlene som leverandører og fageksperter har satt sammen.
      <br />
      <br />
      Man trenger ikke å velge alle hjelpemidler fra lista. Det kan være flere alternativer av samme type, der man kun
      trenger å velge én.
    </BodyLong>
  )

  return (
    <HGrid gap={'20 8'} columns={{ sm: 1, md: 2 }} className={styles.middleContainer} paddingBlock={'6 0'}>
      <div style={{ gridArea: 'box1' }}>
        <ProductInformation product={product} />
      </div>
      <VStack gap={'6'} style={{ gridArea: 'box2' }}>
        {product.agreements.length > 0 && <OtherProductsOnPost agreements={product.agreements} />}

        {worksWithShowConstrain && (
          <Accordion size={'small'} indent={false}>
            <Accordion.Item defaultOpen className={styles.accordionLast} onOpenChange={() => setOpen(!open)}>
              <Accordion.Header className={styles.accordion}>
                <HStack gap="2" align="center">
                  Virker sammen med
                  <HelpText placement="right">{helpTextWorksWith}</HelpText>
                </HStack>
              </Accordion.Header>
              <Accordion.Content>
                <WorksWithSection products={worksWithProducts} />
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
      <BodyShort size="medium" as="label">
        Filter
      </BodyShort>
      <Chips size={'small'} aria-label="Filter på komponenttyper" className={styles.chips}>
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
  const [displayCount, setDisplayCount] = useState(WORKS_WITH_CONFIG.productsPerPage)

  useEffect(() => {
    setDisplayCount(WORKS_WITH_CONFIG.productsPerPage)
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
    setDisplayCount((prev) => prev + WORKS_WITH_CONFIG.productsPerPage)
    logUmamiClickButton('vis-flere-produkter', 'product-worksWith-loadMore', 'secondary')
  }

  const handleComponentTypeToggle = (type: string) => {
    setSelectedComponentTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
    logUmamiFilterChangeEvent('product-worksWith-filter', 'chips-componentType', type)
  }

  return (
    <VStack gap={'4'}>
      <ComponentTypeFilter
        componentTypes={componentTypes}
        selectedTypes={selectedComponentTypes}
        onToggle={handleComponentTypeToggle}
      />
      {/*      <BodyShort size="small">{products.length}</BodyShort>*/}
      {displayedProducts.map((workWithProduct: Product) => (
        <ProductCardWorksWith key={workWithProduct.id} product={workWithProduct} />
      ))}

      {filteredProducts.length === 0 && <p>Ingen produkter matcher valgt filter.</p>}

      {hasMoreProducts && (
        <Button
          variant="tertiary"
          size="medium"
          icon={<ChevronDownIcon />}
          iconPosition={'right'}
          onClick={handleLoadMore}
          className={styles.buttonLoadMore}
        >
          Vis flere
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
