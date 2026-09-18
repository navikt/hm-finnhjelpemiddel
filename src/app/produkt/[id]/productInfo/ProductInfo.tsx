'use client'

import { CompareButton } from '@/app/produkt/CompareButton'
import { Videos } from '@/app/produkt/[id]/Videos'
import { Documents } from '@/app/produkt/[id]/productInfo/Documents'
import {
  BestillingsordningBehovsmelding,
  Description,
  ISOCategory,
} from '@/app/produkt/[id]/productInfo/GeneralProductInformation'
import { WorksWith } from '@/app/produkt/[id]/productInfo/WorksWith'
import { ImageCarousel } from '@/app/produkt/imageCarousel/ImageCarousel'

import React, { useEffect, useState } from 'react'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

import { QRCodeCanvas } from 'qrcode.react'

import { LinkIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, HGrid, HStack, Heading, HelpText, Link, Tabs, Tag, VStack } from '@navikt/ds-react'

import { AgreementInfo, Product } from '@/utils/product-util'

import styles from './ProductInfo.module.scss'

export const ProductInfo = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  const worksWithSeriesIds = product.attributes.worksWith?.seriesIds

  const isExpired = product.variants.every((variant) => new Date(variant.expired).getTime() <= Date.now())

  return (
    <HGrid columns={{ xs: 1, md: 2 }} gap={'space-8'} paddingInline={'space-16'}>
      {product.photos && <ImageCarousel images={product.photos} />}

      <VStack gap={'space-24'}>
        <VStack gap={'space-20'}>
          <VStack gap={'space-8'} align={'start'}>
            <HStack gap={{ xs: 'space-16', md: 'space-24' }} width={'100%'}>
              <CompareButton product={product} />
              <StatusTag productAgreements={product.agreements} isExpired={isExpired} />
            </HStack>
            <Heading size={'xlarge'}>{hmsartnr ? product.variants[0].articleName : product.title}</Heading>
            <Link as={NextLink} href={`/leverandorer#${product.supplierId}`}>
              <BodyShort weight={'semibold'}>{product.supplierName}</BodyShort>
            </Link>
          </VStack>
          <VStack gap={'space-8'} align={'start'}>
            {hmsartnr && (
              <HStack gap={'space-4'}>
                <BodyShort weight={'semibold'} size={'small'}>
                  Serie:
                </BodyShort>
                <BodyShort size={'small'}>{product.title}</BodyShort>
              </HStack>
            )}
            <Description description={product.attributes.text} />
            <Link as={NextLink} href={`/produkt/${product.id}/deler`}>
              Tilbehør og reservedeler <LinkIcon aria-hidden fontSize={'24px'} />
            </Link>
          </VStack>
        </VStack>

        <Tabs defaultValue={'info'}>
          <Tabs.List style={{ whiteSpace: 'nowrap' }}>
            <Tabs.Tab value={'info'} label={'Informasjon'} />
            <Tabs.Tab value={'docs'} label={'Dokumenter'} />
            <Tabs.Tab value={'video'} label={'Videoer'} />
            {worksWithSeriesIds && <Tabs.Tab value={'works'} label={'Virker sammen med'} />}
          </Tabs.List>
          <Tabs.Panel value={'info'} className={styles.tabPanel}>
            <InfoTab product={product} hmsartnr={hmsartnr} />
          </Tabs.Panel>
          <Tabs.Panel value={'docs'} className={styles.tabPanel}>
            <Documents documents={product.documents} documentUrls={product.attributes.documentUrls ?? []} />
          </Tabs.Panel>
          <Tabs.Panel value={'video'} className={styles.tabPanel}>
            <Videos videos={product.videos} />
          </Tabs.Panel>
          {worksWithSeriesIds && (
            <Tabs.Panel value={'works'} className={styles.tabPanel}>
              <WorksWith worksWithSeriesIds={worksWithSeriesIds} />
            </Tabs.Panel>
          )}
        </Tabs>
      </VStack>
    </HGrid>
  )
}

const InfoTab = ({ product, hmsartnr }: { product: Product; hmsartnr?: string }) => {
  const qrId = hmsartnr ? hmsartnr : product.id

  const bestillingsordning = new Set(product.variants.map((p) => p.bestillingsordning))
  const digitalsoknad = new Set(product.variants.map((p) => p.digitalSoknad))
  const helpTextBestilling =
    'Bestillingsordningen er en forenkling av saksbehandling. Gjennom denne ordningen kan man bestille enkle\n' +
    '        hjelpemidler som hjelpemiddelsentralene har på lager.'
  const helpTextSoknad =
    'Digital behovsmelding betyr at man kan melde behov for hjelpemidler digitalt, og gjelder for et utvalg av\n' +
    '        hjelpemidler innen utvalgte kategorier. Ordningen kan benyttes av kommunalt ansatte.'

  return (
    <VStack gap={'space-24'}>
      <HStack gap={'space-20'} justify={'space-between'} style={{ flexWrap: 'wrap-reverse' }} align={'start'}>
        <VStack gap={'space-8'}>
          <BestillingsordningBehovsmelding
            heading={'Bestillingsordning'}
            helpText={helpTextBestilling}
            sett={bestillingsordning}
          />
          <BestillingsordningBehovsmelding
            heading={'Digital behovsmelding'}
            helpText={helpTextSoknad}
            sett={digitalsoknad}
          />
        </VStack>
      </HStack>
      <ISOCategory
        isoCategory={product.isoCategory}
        isoCategoryTitle={product.isoCategoryTitle}
        isoCategoryTitleInternational={product.isoCategoryTitleInternational}
      />
      <QrCodeButtonSmall id={qrId} />
    </VStack>
  )
}

export const QrCodeButtonSmall = ({ id }: { id: string }) => {
  const [qrUrl, setQrUrl] = useState('')
  const pathname = usePathname()
  const url = `https://finnhjelpemiddel.nav.no${pathname}`

  useEffect(() => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    ctx.font = '2px Arial'
    ctx.fillText(id, 3, 3)

    const qrUrl = canvas.toDataURL('image/png')
    setQrUrl(qrUrl)
  }, [id])

  return (
    <Button
      size="xsmall"
      style={{
        border: '1px dashed var(--Border-Action, #0067C5)',
        borderRadius: '4px',
        maxWidth: 'fit-content',
        textDecoration: 'underline',
      }}
      variant={'tertiary'}
      as="a"
      href={qrUrl}
      download={id + '-qr.png'}
    >
      Last ned QR-kode
      <div style={{ display: 'none' }}>
        <QRCodeCanvas marginSize={4} value={url} id="qr-canvas" />
      </div>
    </Button>
  )
}

const StatusTag = ({
  productAgreements,
  isExpired,
}: {
  productAgreements: AgreementInfo[] | undefined
  isExpired: boolean
}) => {
  const helpHvaEr = (
    <>
      Alle hjelpemidlene på FinnHjelpemiddel som er på avtale er markert med «På avtale». I tillegg er de markert med
      «Delkontrakt» og «Rangering». I mange tilfeller er det nyttig å samarbeide med en fagperson i kommunen for å komme
      frem til det til det mest hensiktsmessige hjelpemidlet, og å skrive selve søknaden.
      <ul>
        <li>
          Delkontrakt: Avtalene inndeles i delkontrakter ut ifra hjelpemidlenes egenskaper. Å lese teksten i
          delkontrakten kan gjøre det lettere for deg å finne det du er ute etter.
        </li>
        <li>
          Rangering: En delkontrakt omfatter som regel flere hjelpemidler. Disse er inndelt i rangeringer. Du må alltid
          starte med å vurdere om hjelpemidlet som er markert med «Rangering 1» dekker ditt behov. Dersom det ikke gjøre
          det må det begrunnes i søknaden.
        </li>
      </ul>
    </>
  )

  const topRank =
    productAgreements &&
    productAgreements?.length > 0 &&
    Math.min(...productAgreements.map((agreement) => agreement.rank))

  return (
    <HStack gap={'space-8'} height={'fit-content'} align={'center'}>
      {topRank ? (
        topRank === 99 ? (
          <Tag variant={'success'} size={'small'}>
            På avtale
          </Tag>
        ) : productAgreements.length == 1 ? (
          <Tag variant={'success-moderate'} size={'small'}>
            Delkontrakt {productAgreements[0].refNr} - Rangering {productAgreements[0].rank}
          </Tag>
        ) : (
          <Tag variant={'success'} size={'small'}>
            Flere delkontrakter
          </Tag>
        )
      ) : isExpired ? (
        <Tag variant={'neutral'} size={'small'}>
          Utgått
        </Tag>
      ) : (
        <Tag variant={'neutral'} size={'small'}>
          Ikke på avtale
        </Tag>
      )}
      <HelpText title={'Hva betyr delkonktrakt og rangering'} placement={'right'} style={{ padding: 0 }}>
        {helpHvaEr}
      </HelpText>
    </HStack>
  )
}
