'use client'

import { Supplier } from '@/utils/supplier-util'
import { Accordion, BodyShort, Heading, Label, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface Props {
  supplier: Supplier
}

export const SupplierAccordion = ({ supplier }: Props) => {
  const location = window.location
  const supplierId_url = location.hash.replace('#', '')
  const [isOpen, setIsOpen] = useState(false)
  const supplierRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (supplier.id === supplierId_url && supplierRef.current) {
      supplierRef.current.style.scrollMargin = '60px'
      supplierRef.current.scrollIntoView({ behavior: 'instant' })

      setIsOpen(true)
    }
  }, [supplierId_url, supplier.id])

  return (
    <Accordion.Item id={supplier.id} ref={supplierRef} open={isOpen}>
      <Accordion.Header onClick={() => setIsOpen(!isOpen)}>
        <Heading level="2" size="small">
          {supplier.name}
        </Heading>
      </Accordion.Header>
      <Accordion.Content>
        <SupplierInfo supplier={supplier} />
      </Accordion.Content>
    </Accordion.Item>
  )
}

const SupplierInfo = ({ supplier }: { supplier: Supplier }) => (
  <VStack gap="1">
    {supplier.address && (
      <VStack gap="0">
        <Label>Adresse</Label>
        {supplier.address && <BodyShort>{supplier.address}</BodyShort>}
        {supplier.postNr && supplier.postLocation && (
          <BodyShort>
            {supplier.postNr} {supplier.postLocation}
          </BodyShort>
        )}
      </VStack>
    )}
    {supplier.email && (
      <VStack>
        <Label>E-post</Label>
        <BodyShort> {supplier.email}</BodyShort>
      </VStack>
    )}
    {supplier.phone && (
      <VStack>
        <Label>Telefon</Label>
        <BodyShort> {supplier.phone}</BodyShort>
      </VStack>
    )}
    {supplier.homepageUrl && (
      <BodyShort>
        <Link href={supplier?.homepageUrl} target="_blank" rel="noreferrer">
          Hjemmeside (åpnes i ny side)
        </Link>
      </BodyShort>
    )}

    <Link as={NextLink} href={`/sok?sortering=Best_soketreff&leverandor=${encodeURIComponent(supplier.name)}`}>
      Se produkter fra {supplier.name}
    </Link>
  </VStack>
)
