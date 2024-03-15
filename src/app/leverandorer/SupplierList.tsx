'use client'

import { Accordion, Heading, VStack } from '@navikt/ds-react'
import { Supplier } from "@/utils/supplier-util";
import { SupplierAccordion } from "@/app/leverandorer/SupplierAccordion";

type Props = {
  suppliers: Supplier[]
  letter: string
}
const SupplierList = ({ suppliers, letter }: Props) => {

  if (suppliers.length === 0) return null


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
          </Accordion>)}
      </VStack>
    </div>
  )
}

export default SupplierList
