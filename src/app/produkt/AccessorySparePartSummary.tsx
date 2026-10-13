'use client'

import { CompareButton } from '@/app/produkt/CompareButton'
import { QrCodeButton } from '@/app/produkt/[id]/QrCodeButton'

import React from 'react'

import { ArrowDownIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { Alert, BodyLong, BodyShort, CopyButton, HStack, HelpText, Link, VStack } from '@navikt/ds-react'

import { EXCLUDED_ISO_CATEGORIES } from '@/utils/api-util'
import { AgreementInfo, Product } from '@/utils/product-util'

import { NeutralTag, SuccessTag } from '@/components/Tags'
import { Heading } from '@/components/aksel-client'
import CompareMenu from '@/components/layout/CompareMenu'

import styles from './AccessorySparePartSummary.module.scss'

export const AccessorySparePartSummary = ({ product }: { product: Product }) => {
  const qrId = product.id
  const isExpired = product.variants.every((variant) => new Date(variant.expired).getTime() <= Date.now())

  return (
    <VStack gap={'space-32'}>
      <TagRow
        productAgreements={product.agreements}
        accessory={product.accessory}
        sparePart={product.sparePart}
        isExpired={isExpired}
        product={product}
      />
      <Link href={`/leverandorer#${product.supplierId}`} className={styles.supplierLink}>
        {product.supplierName}
      </Link>
      <Heading level="1" size="large">
        {product.title}
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
        <div>
          <Heading size={'xsmall'} level={'2'}>
            Produktkategori
          </Heading>
          {product.isoCategoryTitle}
        </div>
      </VStack>
      <CopyHms product={product} />
      <CopyLevart product={product} />
      <HStack gap={'space-24'}>
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

const CopyHms = ({ product }: { product: Product }) => {
  if (product.variants.length === 0) {
    return <></>
  }

  return (
    <>
      <VStack gap={'space-8'} align={'start'}>
        <Heading level="3" size="xsmall">
          HMS-nummer
        </Heading>
        {product.variants.length === 1 ? (
          <CopyButton
            size="medium"
            className={styles.copyButton}
            copyText={product.variants[0].hmsArtNr ?? ''}
            text={product.variants[0].hmsArtNr ?? ''}
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

const CopyLevart = ({ product }: { product: Product }) => {
  if (product.variants.length === 0) {
    return <></>
  }

  return (
    <>
      <VStack gap={'space-8'} align={'start'}>
        <Heading level="3" size="xsmall">
          LevArt-nummer
        </Heading>
        {product.variants.length === 1 ? (
          <CopyButton
            size="medium"
            className={styles.copyButton}
            copyText={product.variants[0].supplierRef ?? ''}
            text={product.variants[0].supplierRef ?? ''}
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
