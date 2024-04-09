'use client'

import React from 'react'

import Link from 'next/link'

import { FilesIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { Accordion, BodyLong, BodyShort, HStack, Heading, Tabs, VStack } from '@navikt/ds-react'

import { Document, Product, Video } from '@/utils/product-util'
import { titleCapitalized } from '@/utils/string-util'
import { Supplier } from '@/utils/supplier-util'
import { VideoplayerIcon } from '@navikt/aksel-icons'

import File from '@/components/File'
import ReactPlayer from 'react-player'

export const InformationTabs = ({ product, supplier }: { product: Product; supplier: Supplier }) => (
  <Tabs defaultValue="productDescription" selectionFollowsFocus>
    <Tabs.List>
      <Tabs.Tab
        value="productDescription"
        label="Produktbeskrivelse fra leverandør"
        icon={<InformationSquareIcon title="Skiftenøkkel" />}
      />
      <Tabs.Tab
        value="documents"
        label={`Tilhørende dokumenter (${product.documents.length})`}
        icon={<FilesIcon title="Dokumenter" />}
      />
      <Tabs.Tab
        value="videos"
        label={`Videolenker (${product.videos.length})`}
        icon={<VideoplayerIcon title="Videolenker" />}
      />
    </Tabs.List>
    <Tabs.Panel value="productDescription" className="h-24 w-full p-4">
      <div className="product-info__tabs__panel">
        <SupplierInfo product={product} supplier={supplier} />
      </div>
    </Tabs.Panel>
    <Tabs.Panel value="documents" className="h-24 w-full p-4">
      <div className="product-info__tabs__panel">
        <Documents documents={product.documents} />
      </div>
    </Tabs.Panel>
    <Tabs.Panel value="videos" className="h-24 w-full p-4">
      <div className="product-info__tabs__panel">
        <Videos videos={product.videos} />
      </div>
    </Tabs.Panel>
  </Tabs>
)

export const InformationAccordion = ({ product, supplier }: { product: Product; supplier: Supplier }) => (
  <Accordion>
    <Accordion.Item>
      <Accordion.Header>Produktbeskrivelse fra leverandør</Accordion.Header>
      <Accordion.Content>
        <div className="product-info__accordion">
          <SupplierInfo product={product} supplier={supplier} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Tilhørende dokumenter ({product.documents.length})</Accordion.Header>
      <Accordion.Content>
        <div className="product-info__accordion">
          <Documents documents={product.documents} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Videolenker ({product.videos.length})</Accordion.Header>
      <Accordion.Content>
        <div className="product-info__accordion">
          <Videos videos={product.videos} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
)

const SupplierInfo = ({ product, supplier }: { product: Product; supplier: Supplier }) => (
  <div className="product-info__supplier-info">
    <Heading level="2" size="xsmall">
      Produktbeskrivelse
    </Heading>
    {product.attributes.text && <BodyLong>{product.attributes.text}</BodyLong>}
    {!product.attributes.text && 'Ingen beskrivelse fra leverandør. Ta kontakt med leverandør for mer informasjon.'}

    <Heading level="2" size="xsmall" style={{ marginTop: '1.5rem' }}>
      Leverandør
    </Heading>
    <>
      <BodyShort>{supplier.name}</BodyShort>
      {supplier.address && <BodyShort>{supplier.address}</BodyShort>}
      {supplier.email && <BodyShort>{supplier.email}</BodyShort>}
      {supplier.homepageUrl && (
        <Link href={supplier?.homepageUrl} target="_blank" rel="noreferrer">
          Hjemmeside (åpnes i ny side)
        </Link>
      )}
    </>
  </div>
)

const Documents = ({ documents }: { documents: Document[] }) => {
  if (!documents.length) {
    return <BodyShort>Ingen dokumenter på dette produktet.</BodyShort>
  }

  return (
    <ul className="document-list">
      {documents.map((doc, index) => (
        <li key={index}>
          <File title={titleCapitalized(doc.title)} path={doc.uri} />
        </li>
      ))}
    </ul>
  )
}

export default InformationTabs

const Videos = ({ videos }: { videos: Video[] }) => {
  if (!videos.length) {
    return <BodyShort>Ingen videolenker til dette produktet.</BodyShort>
  }
  return (
    <HStack as="ul" gap="8" className="video-list">
      {videos.map((video, index) => (
        <VStack as="li" key={index} gap="4">
          <Link target="_blank" title={video.uri} href={video.uri}>
            {video.text || video.uri}
          </Link>
          <ReactPlayer url={video.uri} controls={true} width="100%" height="100%" />
        </VStack>
      ))}
    </HStack>
  )
}
