'use client'

import { AgreementInfo, Product } from '@/utils/product-util'
import ImageCarousel from '@/app/produkt/imageCarousel/ImageCarousel'
import { Alert, BodyLong, BodyShort, Button, CopyButton, HelpText, HGrid, HStack, Link, VStack } from '@navikt/ds-react'
import { Heading } from '@/components/aksel-client'
import NextLink from 'next/link'
import styles from './ProductTop.module.scss'
import { ArrowDownIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { QrCodeButton } from '@/app/produkt/[id]/QrCodeButton'
import { EXCLUDED_ISO_CATEGORIES, fetchCompatibleProducts } from '@/utils/api-util'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import useSWR from 'swr'

const ProductTop = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  return (
    <HGrid columns={{ sm: 1, md: 2 }} gap={'8'}>
      {product.photos && <ImageCarousel images={product.photos} />}
      <ProductSummary product={product} hmsartnr={hmsartnr} />
    </HGrid>
  )
}

const ProductSummary = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  const { data: compatibleWithProducts } = useSWR(product.id, fetchCompatibleProducts, { keepPreviousData: true })
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
            <Heading size={'xsmall'} level={'2'}>
              Serie
            </Heading>
            {product.title}
          </div>
        )}
        <div>
          <Heading size={'xsmall'} level={'2'}>
            Produktkategori
          </Heading>
          {product.isoCategoryTitle}
        </div>
      </VStack>
      <CopyHms product={product} />
      <HStack gap={'6'}>
        {compatibleWithProducts && compatibleWithProducts.length > 0 && <AccessoriesAndParts productId={product.id} />}
        <QrCodeButton id={qrId} />
      </HStack>
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
  const helpTextTopLabels = () => {
    return (
      <>
        <Heading size="small">Flere delkontrakter og (flere) rangeringer</Heading>
        <BodyLong>
          Hjelpemiddelet er på avtale med Nav. Det er på flere delkontrakter og har flere rangeringer.
          <br />
          <br />
          For mer info se gjeldende delkontrakt/er som er listet opp her på siden under tittel: &ldquo;Andre
          hjelpemidler på delkontrakt&rdquo;.
        </BodyLong>
      </>
    )
  }

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
          {topRank !== 99 && (
            <>
              {productAgreements.length <= 2 && (
                <SuccessTag>
                  Delkontrakt {productAgreements[0].refNr} - rangering {productAgreements[0].rank}
                </SuccessTag>
              )}
              {productAgreements.length === 2 && (
                <SuccessTag>
                  Delkontrakt {productAgreements[1].refNr} - rangering {productAgreements[1].rank}
                </SuccessTag>
              )}
              {productAgreements.length > 2 && (
                <>
                  <SuccessTag>Flere delkontrakter og rangeringer</SuccessTag>
                  <HelpText placement="right">{helpTextTopLabels()}</HelpText>
                </>
              )}
            </>
          )}
          {topRank === 99 && <SuccessTag>På avtale</SuccessTag>}
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

const AccessoriesAndParts = ({ productId }: { productId: string }) => {
  return (
    <VStack gap={'6'}>
      <Button
        size="medium"
        className={styles.button}
        as={NextLink}
        variant={'primary'}
        href={`/produkt/${productId}/deler`}
      >
        Tilbehør og reservedeler
      </Button>
    </VStack>
  )
}

export default ProductTop
