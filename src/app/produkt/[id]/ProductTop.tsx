'use client'

import { QrCodeButton } from '@/app/produkt/[id]/QrCodeButton'
import { ImageCarousel } from '@/app/produkt/imageCarousel/ImageCarousel'
import { CompareButton } from '@/app/rammeavtale/hjelpemidler/[agreementId]/CompareButton'

import React from 'react'

import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'

import useSWR from 'swr'

import { ArrowDownIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { Alert, BodyLong, BodyShort, Button, CopyButton, HGrid, HStack, HelpText, Link, VStack } from '@navikt/ds-react'

import { EXCLUDED_ISO_CATEGORIES, fetchCompatibleProducts } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { AgreementInfo, Product, ProductVariant } from '@/utils/product-util'

import { NeutralTag, SuccessTag } from '@/components/Tags'
import { Heading } from '@/components/aksel-client'
import CompareMenu from '@/components/layout/CompareMenu'

import styles from './ProductTop.module.scss'

const ProductTop = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  return (
    <HGrid columns={{ sm: 1, md: 2 }} gap={'space-32'}>
      {product.photos && <ImageCarousel images={product.photos} />}
      <ProductSummary product={product} hmsartnr={hmsartnr} />
    </HGrid>
  )
}

const ProductSummary = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  const { data: compatibleWithProducts } = useSWR(product.id, fetchCompatibleProducts, { keepPreviousData: true })
  const qrId = hmsartnr ? hmsartnr : product.variants.length === 1 ? product.variants[0].id : product.id
  const isExpired = product.variants.every((variant) => new Date(variant.expired).getTime() <= Date.now())
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const searchTermMatchesHms = product.variants
    .flatMap((variant) => [variant.hmsArtNr?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())
  const searchTermMatchesSupplierRef = product.variants
    .flatMap((variant) => [variant.supplierRef?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())

  const matchingVariant = searchTermMatchesHms
    ? product.variants.find((v) => v.hmsArtNr?.toLowerCase() === searchData.searchTerm?.toLowerCase())
    : searchTermMatchesSupplierRef
      ? product.variants.find((v) => v.supplierRef?.toLowerCase() === searchData.searchTerm?.toLowerCase())
      : null
  const relevantAgreements = matchingVariant ? matchingVariant.agreements : product.agreements

  const isExpiredRefined = matchingVariant ? new Date(matchingVariant.expired).getTime() <= Date.now() : isExpired

  return (
    <VStack gap={'space-32'}>
      <TagRow
        productAgreements={relevantAgreements}
        accessory={product.accessory}
        sparePart={product.sparePart}
        isExpired={isExpiredRefined}
        product={product}
      />
      <Link href={`/leverandorer#${product.supplierId}`} className={styles.supplierLink}>
        {product.supplierName}
      </Link>
      <Heading level="1" size="large">
        {hmsartnr ? product.variants[0].articleName : matchingVariant ? matchingVariant.articleName : product.title}
      </Heading>
      {EXCLUDED_ISO_CATEGORIES.includes(product.isoCategory) && (
        <Alert variant="warning" size="small">
          Kun autoriserte leger i Norge kan bestille hjelpemidler for seksuallivet. Les mer på{' '}
          <Link href="https://www.nav.no/seksualtekniskehjelpemidler" target="_blank" rel="noopener noreferrer">
            nav.no
          </Link>
        </Alert>
      )}
      <VStack gap={'space-16'}>
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
      <CopyHms product={product} matchingVariant={matchingVariant} />
      {(product.accessory || product.sparePart) && <CopyLevart product={product} matchingVariant={matchingVariant} />}
      <HStack gap={'space-24'}>
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
  product,
}: {
  productAgreements: AgreementInfo[] | undefined
  accessory: boolean | undefined
  sparePart: boolean | undefined
  isExpired: boolean
  product: Product
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
    <HStack justify={'start'} gap={'space-12'}>
      {accessory || sparePart ? (
        <HStack gap="space-12">
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
              {productAgreements.length === 2 && productAgreements[1].rank != 99 && (
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
        !isExpired && <NeutralTag>Ikke på avtale</NeutralTag>
      )}
      {isExpired && <NeutralTag>Utgått</NeutralTag>}
      <CompareButton product={product} />
      <CompareMenu />
    </HStack>
  )
}

const CopyHms = ({ product, matchingVariant }: { product: Product; matchingVariant?: ProductVariant | null }) => {
  const variantsToUse = matchingVariant ? [matchingVariant] : product.variants
  const hmsArtNumbers = new Set(variantsToUse.map((p) => p.hmsArtNr).filter((hms) => hms))

  if (hmsArtNumbers.size === 0) {
    return <></>
  }

  return (
    <>
      <VStack gap={'space-8'} align={'start'}>
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
          <HStack as={Link} href="#variants-table">
            <BodyShort>Se tabell med varianter</BodyShort> <ArrowDownIcon aria-hidden fontSize={'24'} />
          </HStack>
        )}
      </VStack>
    </>
  )
}

const CopyLevart = ({ product, matchingVariant }: { product: Product; matchingVariant?: ProductVariant | null }) => {
  const variantsToUse = matchingVariant ? [matchingVariant] : product.variants
  const levArtNumbers = new Set(variantsToUse.map((p) => p.supplierRef).filter((levArt) => levArt))

  if (levArtNumbers.size === 0) {
    return <></>
  }

  return (
    <>
      <VStack gap={'space-8'} align={'start'}>
        <Heading level="3" size="xsmall">
          LevArt-nummer
        </Heading>
        {levArtNumbers.size === 1 ? (
          <CopyButton
            size="medium"
            className={styles.copyButton}
            copyText={[...levArtNumbers.values()][0] || ''}
            text={[...levArtNumbers.values()][0] || ''}
            activeText="kopiert"
            variant="action"
            activeIcon={<ThumbUpIcon aria-hidden />}
            iconPosition="right"
          />
        ) : (
          <HStack as={Link} href="#variants-table">
            <BodyShort>Se tabell med varianter</BodyShort> <ArrowDownIcon aria-hidden fontSize={'24'} />
          </HStack>
        )}
      </VStack>
    </>
  )
}

const AccessoriesAndParts = ({ productId }: { productId: string }) => {
  return (
    <VStack gap={'space-24'}>
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
