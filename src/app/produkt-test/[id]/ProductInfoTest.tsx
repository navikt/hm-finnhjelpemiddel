'use client'

import { AgreementInfo, Product } from '@/utils/product-util'
import { Button, Heading, HelpText, HGrid, HStack, Link, Tabs, Tag, VStack } from '@navikt/ds-react'
import ImageCarousel from '@/app/produkt/imageCarousel/ImageCarousel'
import NextLink from 'next/link'
import { Density2Icon, FolderFileIcon, LinkIcon } from '@navikt/aksel-icons'
import { BestillingsordningBehovsmelding, Description, ISOCategory } from '@/app/produkt/[id]/GeneralProductInformation'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { QRCodeCanvas } from 'qrcode.react'
import { Videos } from '@/app/produkt/[id]/Videos'
import { Documents } from '@/app/produkt/[id]/Documents'
import styles from './ProductInfo.module.scss'
import { WorksWith } from '@/app/produkt/[id]/WorksWith'

export const ProductInfoTest = ({ product }: { product: Product }) => {
  const worksWithSeriesIds = product.attributes.worksWith?.seriesIds

  return (
    <HGrid columns={{ xs: 1, md: 2 }} gap={'space-8'}>
      {product.photos && <ImageCarousel images={product.photos} />}

      <VStack gap={'space-8'}>
        <Heading size={'xlarge'}>{product.title}</Heading>
        <Link as={NextLink} href={`/leverandorer#${product.supplierId}`}>
          {product.supplierName}
        </Link>
        <Description description={product.attributes.text} />
        <Link as={NextLink} href={`/produkt/${product.id}/deler`}>
          Tilbehør og reservedeler <LinkIcon aria-hidden />
        </Link>

        <Tabs defaultValue={'info'}>
          <Tabs.List>
            <Tabs.Tab value={'info'} label={'Informasjon'} />
            <Tabs.Tab value={'docs'} label={'Dokumenter'} />
            <Tabs.Tab value={'video'} label={'Videoer'} />
            {worksWithSeriesIds && <Tabs.Tab value={'works'} label={'Virker sammen med'} />}
          </Tabs.List>
          <Tabs.Panel value={'info'} className={styles.tabPanel}>
            <InfoTab product={product} />
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

const InfoTab = ({ product }: { product: Product }) => {
  const isExpired = product.variants.every((variant) => new Date(variant.expired).getTime() <= Date.now())

  const bestillingsordning = new Set(product.variants.map((p) => p.bestillingsordning))
  const digitalsoknad = new Set(product.variants.map((p) => p.digitalSoknad))
  const helpTextBestilling =
    'Bestillingsordningen er en forenkling av saksbehandling. Gjennom denne ordningen kan man bestille enkle\n' +
    '        hjelpemidler som hjelpemiddelsentralene har på lager.'
  const helpTextSoknad =
    'Digital behovsmelding betyr at man kan melde behov for hjelpemidler digitalt, og gjelder for et utvalg av\n' +
    '        hjelpemidler innen utvalgte kategorier. Ordningen kan benyttes av kommunalt ansatte.'

  return (
    <VStack gap={'space-8'}>
      <HStack gap={'space-20'} justify={'space-between'}>
        <div>
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
        </div>
        <TagRow
          productAgreements={product.agreements}
          accessory={product.accessory}
          sparePart={product.sparePart}
          isExpired={isExpired}
        />
      </HStack>
      <ISOCategory
        isoCategory={product.isoCategory}
        isoCategoryTitle={product.isoCategoryTitle}
        isoCategoryTitleInternational={product.isoCategoryTitleInternational}
      />
      <QrCodeButtonSmall id={product.id} />
    </VStack>
  )
}
const VideoTab = ({ product }: { product: Product }) => {}
const DocsTab = ({ product }: { product: Product }) => {}

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
      style={{ border: '1px dashed var(--Border-Action, #0067C5)', borderRadius: '4px', maxWidth: 'fit-content' }}
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

  const accessoryOrSparePart = accessory || sparePart

  return (
    <HStack gap={'space-12'} height={'fit-content'}>
      {accessoryOrSparePart ? (
        <Tag variant={'success'} size={'xsmall'}>
          {accessory ? 'Tilbehør' : 'Reservedel'}
        </Tag>
      ) : topRank ? (
        topRank === 99 ? (
          <Tag variant={'success'} size={'xsmall'}>
            På avtale
          </Tag>
        ) : productAgreements.length == 1 ? (
          <VStack gap={'space-2'} align={'start'}>
            <Tag variant={'success'} size={'xsmall'} icon={<FolderFileIcon aria-hidden />}>
              Delkontrakt {productAgreements[0].refNr}
            </Tag>
            <Tag variant={'success'} size={'xsmall'} icon={<Density2Icon aria-hidden />}>
              Rangering {productAgreements[0].rank}
            </Tag>
          </VStack>
        ) : (
          <Tag variant={'success'} size={'xsmall'}>
            Flere delkontrakter
          </Tag>
        )
      ) : isExpired ? (
        <Tag variant={'success'} size={'xsmall'}>
          Utgått
        </Tag>
      ) : (
        <Tag variant={'success'} size={'xsmall'}>
          Ikke på avtale
        </Tag>
      )}
      <HelpText placement={'right'} style={{ padding: 0 }}>
        {helpHvaEr}
      </HelpText>
    </HStack>
  )
}
