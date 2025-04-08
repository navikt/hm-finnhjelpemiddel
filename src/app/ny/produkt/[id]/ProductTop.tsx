'use client'

import { Product } from '@/utils/product-util'
import ImageCarousel from '@/app/produkt/imageCarousel/ImageCarousel'
import { BodyShort, Button, CopyButton, HGrid, HStack, Link, Tag, VStack } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import NextLink from 'next/link'
import styles from './ProductTop.module.scss'
import { ArrowDownIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { logActionEvent } from '@/utils/amplitude'
import { QrCodeButton } from '@/app/ny/produkt/[id]/QrCodeButton'

const ProductTop = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  return (
    <HGrid columns={{ sm: 1, md: 2 }} gap={'8'}>
      {product.photos && <ImageCarousel images={product.photos} />}
      <ProductSummary product={product} hmsartnr={hmsartnr} />
    </HGrid>
  )
}

const ProductSummary = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  const topRank =
    product.agreements &&
    product.agreements?.length > 0 &&
    Math.min(...product.agreements.map((agreement) => agreement.rank))
  const qrId = hmsartnr ? hmsartnr : product.variants.length === 1 ? product.variants[0].id : product.id

  return (
    <VStack gap={'8'}>
      <VStack gap={'4'}>
        <HStack justify={'space-between'}>
          {topRank && (
            <Tag variant={'success-moderate'} className={styles.agreementTag}>
              Rangering {topRank}
            </Tag>
          )}
          <Link as={NextLink} href={`/leverandorer#${product.supplierId}`} className={styles.supplierLink}>
            {product.supplierName}
          </Link>
        </HStack>

        {product.agreements.length > 1 && <BodyShort>Hjelpemiddelet er på flere delkontrakter. </BodyShort>}
        {product.agreements.length === 1 && <BodyShort>Delkontrakt {product.agreements[0].postNr}</BodyShort>}
      </VStack>
      <VStack gap={'2'}>
        <Heading level="1" size="large" spacing>
          {hmsartnr ? product.variants[0].articleName : product.title}
        </Heading>
        <VStack gap={'4'}>
          {hmsartnr && (
            <div>
              <Heading size={'xsmall'} level={'3'}>
                Serie
              </Heading>
              {product.title}
            </div>
          )}
          <div>
            <Heading size={'xsmall'} level={'3'}>
              Produktkategori
            </Heading>
            {product.isoCategoryTitle}
          </div>
        </VStack>
      </VStack>

      <CopyHms product={product} />
      <QrCodeButton id={qrId} />
    </VStack>
  )
}

const CopyHms = ({ product }: { product: Product }) => {
  const hmsArtNumbers = new Set(product.variants.map((p) => p.hmsArtNr).filter((hms) => hms))

  if (hmsArtNumbers.size === 0) {
    return <></>
  }

  return (
    <>
      <VStack gap={'2'} align={'start'}>
        <Heading level="3" size="xsmall">
          HMS-nummer
        </Heading>
        {hmsArtNumbers.size === 1 ? (
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
        ) : (
          <BodyShort>
            <Button
              className={styles.linkButton}
              as={NextLink}
              href="#variants-table"
              variant={'tertiary'}
              icon={<ArrowDownIcon aria-hidden />}
              iconPosition={'right'}
            >
              Se tabell med varianter
            </Button>
          </BodyShort>
        )}
      </VStack>
    </>
  )
}

export default ProductTop
