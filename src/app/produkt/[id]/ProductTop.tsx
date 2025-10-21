'use client'

import { AgreementInfo, Product } from '@/utils/product-util'
import ImageCarousel from '@/app/produkt/imageCarousel/ImageCarousel'
import { Alert, BodyShort, Button, CopyButton, HGrid, HStack, Link, VStack } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import NextLink from 'next/link'
import styles from './ProductTop.module.scss'
import { ArrowDownIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { logActionEvent } from '@/utils/amplitude'
import { QrCodeButton } from '@/app/produkt/[id]/QrCodeButton'
import { EXCLUDED_ISO_CATEGORIES } from '@/utils/api-util'
import { NeutralTag, SuccessTag } from '@/components/Tags'

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
  const isExpired = product.variants.every((variant) => new Date(variant.expired).getTime() <= Date.now())

  return (
    <VStack gap={'8'}>
      <TagRow
        productAgreements={product.agreements}
        accessory={product.accessory}
        sparePart={product.sparePart}
        isExpired={isExpired}
      />
      <Link href={`/leverandorer#${product.supplierId}`} className={styles.supplierLink}>
        {product.supplierName}
      </Link>
      <Heading level="1" size="large">
        {hmsartnr ? product.variants[0].articleName : product.title}
      </Heading>

      {EXCLUDED_ISO_CATEGORIES.includes(product.isoCategory) && (
        <Alert variant="warning" size="small">
          Kun autoriserte leger i Norge kan bestille hjelpemidler for seksuallivet. Les mer på{' '}
          <Link href="https://www.nav.no/seksualtekniskehjelpemidler" target="_blank" rel="noopener noreferrer">
            nav.no
          </Link>
        </Alert>
      )}

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

const TagRow = ({
  productAgreements,
  accessory,
  sparePart,
  isExpired,
}: {
  productAgreements: AgreementInfo[] | undefined
  accessory: boolean | undefined
  sparePart: boolean | undefined
  isExpired: boolean
}) => {
  const topRank =
    productAgreements &&
    productAgreements?.length > 0 &&
    Math.min(...productAgreements.map((agreement) => agreement.rank))
  const rankList = productAgreements?.map((agreement) => agreement.rank).sort((a, b) => a - b)
  return (
    <HStack justify={'start'} gap={'3'}>
      {accessory || sparePart ? (
        <HStack gap="3">
          <NeutralTag>{accessory ? 'Tilbehør' : 'Reservedel'}</NeutralTag>
        </HStack>
      ) : (
        ''
      )}
      {topRank ? (
        <>
          <SuccessTag>{topRank === 99 ? 'På avtale' : `Rangering ${topRank}`}</SuccessTag>
          {productAgreements.length === 2 ? <SuccessTag>Rangering {rankList?.[1]}</SuccessTag> : ''}
          {productAgreements.length > 2 ? (
            <NeutralTag>Flere delkontrakter</NeutralTag>
          ) : (
            productAgreements.length <= 2 &&
            productAgreements[0].refNr !== '99' && (
              <>
                <NeutralTag>Delkontrakt {productAgreements[0].refNr}</NeutralTag>
                <NeutralTag>Delkontrakt {productAgreements[1]?.refNr}</NeutralTag>
              </>
            )
          )}
        </>
      ) : (
        <NeutralTag>Ikke på avtale</NeutralTag>
      )}
      {isExpired && <NeutralTag>Utgått</NeutralTag>}
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
