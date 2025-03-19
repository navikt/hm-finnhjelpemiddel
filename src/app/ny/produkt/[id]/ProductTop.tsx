import { containsHTML, Product, validateHTML } from '@/utils/product-util'
import ImageCarousel from '@/app/produkt/imageCarousel/ImageCarousel'
import { BodyLong, HGrid, HStack, Link, Tag, VStack } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import AgreementIcon from '@/components/AgreementIcon'
import NextLink from 'next/link'
import styles from './ProductTop.module.scss'

const ProductTop = ({ product }: { product: Product }) => {
  return (
    <HGrid columns={2}>
      {product.photos && <ImageCarousel images={product.photos} />}
      <ProductSummary product={product} />
    </HGrid>
  )
}

const ProductSummary = ({ product }: { product: Product }) => {
  const topRank =
    product.agreements &&
    product.agreements?.length > 0 &&
    Math.min(...product.agreements.map((agreement) => agreement.rank))

  const htmlDescription = containsHTML(product.attributes.text) && validateHTML(product.attributes.text)

  return (
    <VStack gap={'4'}>
      <HStack justify={'space-between'}>
        {topRank && (
          <Tag variant={'success-moderate'} style={{ width: '36px' }}>
            R{topRank}
          </Tag>
        )}
        <Link as={NextLink} href={`/leverandorer#${product.supplierId}`} className={styles.supplierLink}>
          {product.supplierName}
        </Link>
      </HStack>
      <Heading level="1" size="large">
        {product.title}
      </Heading>
      {product.attributes.text && htmlDescription && (
        <div dangerouslySetInnerHTML={{ __html: product.attributes.text }} />
      )}
      {product.attributes.text && !htmlDescription && (
        <BodyLong spacing className="product-page__description">
          {product.attributes.text}
        </BodyLong>
      )}
    </VStack>
  )
}

export default ProductTop
