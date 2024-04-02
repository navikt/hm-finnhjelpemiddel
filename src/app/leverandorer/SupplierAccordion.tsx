'use client'

import { Accordion, BodyShort, Link } from "@navikt/ds-react";
import React from "react";
import { Supplier } from "@/utils/supplier-util";
import NextLink from "next/link";
import { logLeverandorprodukterKlikket } from "@/utils/amplitude";

interface Props {
  supplier: Supplier;
}

export const SupplierAccordion = ({ supplier }: Props) => {
  return (
    <Accordion.Item>
      <Accordion.Header>
        {supplier.name}
      </Accordion.Header>
      <Accordion.Content>
        <div className="product-info__accordion">
          <SupplierInfo supplier={supplier} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
}


const SupplierInfo = ({ supplier }: { supplier: Supplier }) => (
  <div>
    {supplier.address && <BodyShort>{supplier.address}</BodyShort>}
    {supplier.postNr && supplier.postLocation && <BodyShort>{supplier.postNr} {supplier.postLocation}</BodyShort>}
    {supplier.email && <BodyShort>{supplier.email}</BodyShort>}
    {supplier.phone && <BodyShort>{supplier.phone}</BodyShort>}
    {supplier.homepageUrl && (
      <BodyShort><Link href={supplier?.homepageUrl} target="_blank" rel="noreferrer">
        Hjemmeside (åpnes i ny side)
      </Link>
      </BodyShort>
    )}

    <Link as={NextLink} href={`/sok?sortering=Best_soketreff&leverandor=${supplier.name}`}
          onClick={() => logLeverandorprodukterKlikket()}>
      Se produkter fra {supplier.name}
    </Link>

  </div>

)
