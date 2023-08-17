'use client'

import React from 'react'

import Link from 'next/link'

import { FilesIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Heading, Tabs } from '@navikt/ds-react'

import { Document, Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

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
  </Tabs>
)

const SupplierInfo = ({ product, supplier }: { product: Product; supplier: Supplier }) => (
  <div className="product-info__supplier-info">
    <Heading level="2" size="xsmall">
      Produktbeskrivelse
    </Heading>
    {product.attributes.shortdescription && <BodyLong spacing>{product.attributes.shortdescription}</BodyLong>}
    {product.attributes.text && <BodyLong>{product.attributes.text}</BodyLong>}

    {!product.attributes.shortdescription &&
      !product.attributes.text &&
      'Ingen beskrivelse fra leverandør. Ta kontakt med leverandør for mer informasjon.'}

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

  const documentLoader = (uri: string) => {
    return `${process.env.CDN_URL}${uri}`
  }

  const titleCapitalized = (documentTitle: string) => {
    const title = documentTitle
    if (title.length == 1) {
      return title.charAt(0).toUpperCase()
    }
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  return (
    <ul>
      {documents.map((doc, index) => (
        <li key={index}>
          {doc.title.length > 0 && (
            <a href={documentLoader(doc.uri)} target="_blank" rel="noreferrer">
              {titleCapitalized(doc.title)} (PDF)
            </a>
          )}
          {doc.title.length == 0 && (
            <a href={documentLoader(doc.uri)} target="_blank" rel="noreferrer">
              Dokument uten navn (PDF)
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}

export default InformationTabs
