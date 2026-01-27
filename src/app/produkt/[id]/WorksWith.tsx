import { Accordion, BodyLong, BodyShort, Button, Chips, HelpText, HStack, VStack } from '@navikt/ds-react'
import styles from '@/app/produkt/[id]/WorksWith.module.scss'
import { useEffect, useMemo, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { FetchSeriesResponse, fetchWorkWithProducts } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import { logUmamiClickButton, logUmamiFilterChangeEvent } from '@/utils/umami'
import { ProductCardWorksWith } from '@/app/produkt/[id]/ProductCardWorksWith'
import { ChevronDownIcon } from '@navikt/aksel-icons'

type Props = {
  worksWithSeriesIds?: string[]
}
const WORKS_WITH_CONFIG = {
  productsPerPage: 5,
}

export const WorksWith = ({ worksWithSeriesIds }: Props) => {
  const { data } = useSWRImmutable<FetchSeriesResponse>(worksWithSeriesIds, fetchWorkWithProducts)
  const worksWithProducts = data?.products

  const helpTextWorksWith = (
    <BodyLong>
      Hjelpemiddelet virker sammen med disse opplistede hjelpemidlene som leverandører og fageksperter har satt sammen.
      <br />
      <br />
      Man trenger ikke å velge alle hjelpemidler fra lista. Det kan være flere alternativer av samme type, der man kun
      trenger å velge én.
    </BodyLong>
  )

  return (worksWithProducts &&
  worksWithProducts.length > 0 && (<Accordion size={'small'} indent={false}>
    <Accordion.Item defaultOpen className={styles.accordionLast}>
      <Accordion.Header className={styles.accordion}>
        <HStack gap="space-8" align="center">
          Virker sammen med
          <HelpText onClick={(event) => event.stopPropagation()} placement="right">
            {helpTextWorksWith}
          </HelpText>
        </HStack>
      </Accordion.Header>
      <Accordion.Content>
        <WorksWithSection products={worksWithProducts} />
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>));
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
    <VStack gap={"space-8"}>
      <BodyShort size="small" as="label">
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
  );
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
    <VStack gap={"space-16"}>
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
          icon={<ChevronDownIcon aria-hidden />}
          iconPosition={'right'}
          onClick={handleLoadMore}
          className={styles.buttonLoadMore}
        >
          Vis flere
        </Button>
      )}
    </VStack>
  );
}
