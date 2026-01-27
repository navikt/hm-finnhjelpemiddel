'use client'

import { SupplierAccordion } from '@/app/leverandorer/SupplierAccordion'
import { Supplier } from '@/utils/supplier-util'
import { Accordion, Heading, VStack } from '@navikt/ds-react'
import styles from './SupplierList.module.scss'

type Props = {
  suppliers: Supplier[]
  letter: string
}
const SupplierList = ({ suppliers, letter }: Props) => {
  return (
    <div>
      <Heading id={letter} size={'xlarge'}>
        {letter}
      </Heading>
      <VStack as="ol" gap="space-16" className={styles.listContainer}>
        {suppliers && suppliers.length > 0 && (
          <Accordion>
            {suppliers.map((supplier) => (
              <SupplierAccordion supplier={supplier} key={supplier.id} />
            ))}
          </Accordion>
        )}
      </VStack>
    </div>
  );
}

export default SupplierList
