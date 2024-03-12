'use client'

import { Accordion, Alert, VStack } from '@navikt/ds-react'
import { Supplier } from "@/utils/supplier-util";
import { SupplierAccordion } from "@/app/leverandorer/[letter]/SupplierAccordion";
import { formatNorwegianLetter } from "@/utils/string-util";

type Props = {
    params: { letter: string }
    suppliers: Supplier[]
}
const SupplierList = ({ params, suppliers }: Props) => {

    return (
        <>
            <VStack as="ol" gap="4" id="supplier-list" className="suppliers-page__list-container">
                {suppliers && suppliers.length > 0 && (
                    <Accordion>
                        {suppliers.map((supplier) => (
                            <SupplierAccordion supplier={supplier} key={supplier.id} />
                        ))}
                    </Accordion>)}
                {suppliers && suppliers.length === 0 &&
                  <Alert variant="warning">Ingen leverandører som starter
                    på {formatNorwegianLetter(params.letter)}</Alert>}
            </VStack>
        </>
    )
}

export default SupplierList
