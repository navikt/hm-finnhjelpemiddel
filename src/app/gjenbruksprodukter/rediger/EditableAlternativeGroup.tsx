import { VStack } from '@navikt/ds-react'
import React from 'react'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import { EditableAlternativeCard } from '@/app/gjenbruksprodukter/rediger/EditableAlternativeCard'

export const EditableAlternativeGroup = ({ alternatives }: { alternatives: AlternativeProduct[] }) => {
  return (
    <VStack>
      {alternatives.map((alternative) => (
        <EditableAlternativeCard alternativeProduct={alternative} key={alternative.id} />
      ))}
    </VStack>
  )
}
