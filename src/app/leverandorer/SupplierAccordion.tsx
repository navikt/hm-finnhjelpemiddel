'use client'

import { logLeverandorprodukterKlikket } from '@/utils/amplitude'
import { Supplier } from '@/utils/supplier-util'
import { Accordion, BodyShort, Heading, Link } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useState } from "react";

interface Props {
  supplier: Supplier
}

export const SupplierAccordion = ({ supplier }: Props) => {
  const location = window.location
  const supplierId_url = location.hash.replace('#', '')

  return (
    <Accordion.Item id={supplier.id}>
      <Accordion.Header>
        <Heading level="2" size="small">
          {supplier.name}
        </Heading>
      </Accordion.Header>
      <Accordion.Content>
        <div className="product-page__accordion">
          <SupplierInfo supplier={supplier} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
}

const SupplierInfo = ({ supplier }: { supplier: Supplier }) => (
  <div>
    {supplier.address && <BodyShort>{supplier.address}</BodyShort>}
    {supplier.postNr && supplier.postLocation && (
      <BodyShort>
        {supplier.postNr} {supplier.postLocation}
      </BodyShort>
    )}
    {supplier.email && <BodyShort>{supplier.email}</BodyShort>}
    {supplier.phone && <BodyShort>{supplier.phone}</BodyShort>}
    {supplier.homepageUrl && (
      <BodyShort>
        <Link href={supplier?.homepageUrl} target="_blank" rel="noreferrer">
          Hjemmeside (åpnes i ny side)
        </Link>
      </BodyShort>
    )}

    <Link
      as={NextLink}
      href={`/sok?sortering=Best_soketreff&leverandor=${supplier.name}`}
      onClick={() => logLeverandorprodukterKlikket()}
    >
      Se produkter fra {supplier.name}
    </Link>
  </div>
)
