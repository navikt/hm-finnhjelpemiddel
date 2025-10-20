import { VStack } from '@navikt/ds-react'
import React, { useState } from 'react'
import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import { EditableAlternativeCard } from '@/app/gjenbruksprodukter/rediger/EditableAlternativeCard'
import { AddAlternative } from '@/app/gjenbruksprodukter/AddAlternative'

export const EditableAlternativeGroup = ({ alternatives }: { alternatives: AlternativeProduct[] }) => {
  const [newAlternative, setNewAlternative] = useState<AlternativeProduct | undefined>(undefined)

  return (
    <VStack gap={'2'}>
      <VStack>
        {alternatives.map((alternative) => (
          <EditableAlternativeCard alternativeProduct={alternative} key={alternative.id} />
        ))}
      </VStack>
      <AddAlternative sourceHmsArtNr={'0'} setNewAlternative={setNewAlternative} />
    </VStack>
  )
}
