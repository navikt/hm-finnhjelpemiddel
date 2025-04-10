'use client'

import { AgreementInfo, Product } from '@/utils/product-util'
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
  const qrId = hmsartnr ? hmsartnr : product.variants.length === 1 ? product.variants[0].id : product.id

  return (
    <VStack gap={'8'}>
      <TagRow productAgreements={product.agreements} />
      <Link as={NextLink} href={`/leverandorer#${product.supplierId}`} className={styles.supplierLink}>
        {product.supplierName}
      </Link>
      <Heading level="1" size="large">
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

      <CopyHms product={product} />
      <QrCodeButton id={qrId} />
    </VStack>
  )
}

const TagRow = ({ productAgreements }: { productAgreements: AgreementInfo[] | undefined }) => {
  const topRank =
    productAgreements &&
    productAgreements?.length > 0 &&
    Math.min(...productAgreements.map((agreement) => agreement.rank))

  return (
    <HStack justify={'start'} gap={'3'}>
      {topRank ? (
        <>
          <Tag variant={'success-moderate'} className={styles.agreementTag}>
            {topRank === 99 ? 'På avtale' : `Rangering ${topRank}`}
          </Tag>
          {productAgreements.length > 1 ? (
            <Tag variant={'success-moderate'} className={styles.agreementTag}>
              Flere delkontrakter
            </Tag>
          ) : (
            productAgreements.length === 1 && (
              <Tag variant={'success-moderate'} className={styles.agreementTag}>
                Delkontrakt {productAgreements[0].postNr}
              </Tag>
            )
          )}
        </>
      ) : (
        <Tag variant={'neutral-moderate'} className={styles.nonAgreementTag}>
          Ikke på avtale
        </Tag>
      )}
    </HStack>
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
