'use client'

import { SupplierAccordion } from '@/app/leverandorer/SupplierAccordion'
import { Supplier } from '@/utils/supplier-util'
import { Accordion, Heading, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'

type Props = {
  suppliers: Supplier[]
  letter: string
}
const SupplierList = ({ suppliers, letter }: Props) => {
  useEffect(() => {
    scrollToElement(window.location.hash.slice(1))
  }, [])

  return (
    <div>
      <Heading id={letter} size={'xlarge'} className="spacing-bottom--small">
        {letter}
      </Heading>
      <VStack as="ol" gap="4" id="supplier-list" className="suppliers-page__list-container">
        {suppliers && suppliers.length > 0 && (
          <Accordion>
            {suppliers.map((supplier) => (
              <SupplierAccordion supplier={supplier} key={supplier.id} />
            ))}
          </Accordion>
        )}
      </VStack>
    </div>
  )
}

export default SupplierList

function scrollToElement(id: string) {
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView()
}
