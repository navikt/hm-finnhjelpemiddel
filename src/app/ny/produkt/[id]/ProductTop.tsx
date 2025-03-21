'use client'

import { containsHTML, Product, validateHTML } from '@/utils/product-util'
import ImageCarousel from '@/app/produkt/imageCarousel/ImageCarousel'
import { BodyLong, BodyShort, Box, CopyButton, HGrid, HStack, Link, Tag, VStack } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import NextLink from 'next/link'
import styles from './ProductTop.module.scss'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { logActionEvent } from '@/utils/amplitude'
import { QrCodeButton } from '@/app/ny/produkt/[id]/QrCodeButton'

const ProductTop = ({ product }: { product: Product }) => {
  return (
    <HGrid columns={2} gap={'8'} className={styles.container}>
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
        {topRank && <Tag variant={'success-moderate'}>R{topRank}</Tag>}
        <Link as={NextLink} href={`/leverandorer#${product.supplierId}`} className={styles.supplierLink}>
          {product.supplierName}
        </Link>
      </HStack>

      {product.agreements.length > 1 && <BodyShort>Hjelpemiddelet er på flere delkontrakter. </BodyShort>}
      {product.agreements.length === 1 && <BodyShort>Delkontrakt {product.agreements[0].postNr}</BodyShort>}

      <VStack gap={'2'}>
        <Heading level="1" size="large">
          {product.title}
        </Heading>
        {product.attributes.text && htmlDescription && (
          <div dangerouslySetInnerHTML={{ __html: product.attributes.text }} />
        )}
        {product.attributes.text && !htmlDescription && <BodyLong>{product.attributes.text}</BodyLong>}
      </VStack>

      <CopyHms product={product} />
      <Box paddingBlock={'2 0'}>
        <QrCodeButton id={product.id} />
      </Box>
    </VStack>
  )
}

const CopyHms = ({ product }: { product: Product }) => {
  const hmsArtNumbers = new Set(product.variants.map((p) => p.hmsArtNr).filter((hms) => hms))

  if (hmsArtNumbers.size === 0) {
    return <></>
  }

  return (
    <VStack gap={'2'} align={'start'}>
      <Heading level="3" size="small">
        Kopier HMS-nummer
      </Heading>
      {hmsArtNumbers.size === 1 && (
        <CopyButton
          size="medium"
          className={styles.copyButton}
          copyText={[...hmsArtNumbers.values()][0] || ''}
          text={[...hmsArtNumbers.values()][0] || ''}
          activeText="kopiert"
          variant="action"
          activeIcon={<ThumbUpIcon aria-hidden />}
          iconPosition="right"
          onClick={() => logActionEvent('kopier')}
        />
      )}
      {hmsArtNumbers.size > 1 && (
        <BodyShort>
          <Link as={NextLink} href="#variants-table">
            Se tabell med varianter
          </Link>
        </BodyShort>
      )}
    </VStack>
  )
}

export default ProductTop
