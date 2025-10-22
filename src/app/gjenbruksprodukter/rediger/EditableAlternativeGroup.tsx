import { VStack } from '@navikt/ds-react'
import React, { useState } from 'react'
import { AlternativeProduct, deleteAlternativeFromGroup } from '@/app/gjenbruksprodukter/alternative-util'
import { EditableAlternativeCard } from '@/app/gjenbruksprodukter/rediger/EditableAlternativeCard'
import { AddAlternative } from '@/app/gjenbruksprodukter/AddAlternative'

export const EditableAlternativeGroup = ({ alternatives }: { alternatives: AlternativeProduct[] }) => {
  const [newAlternative, setNewAlternative] = useState<AlternativeProduct | undefined>(undefined)

  const alternativeGroup = alternatives.map((alternative) => alternative.hmsArtNr!)

  return (
    <VStack gap={'2'}>
      <VStack>
        {alternatives.map((alternative) => (
          <EditableAlternativeCard
            alternativeProduct={alternative}
            onDelete={
              () => deleteAlternativeFromGroup(alternativeGroup, alternative.hmsArtNr!) //.then(() => mutateAlternatives())
            }
            key={alternative.variantId}
          />
        ))}
      </VStack>
      <AddAlternative alternativeGroup={alternativeGroup} setNewAlternative={setNewAlternative} />
    </VStack>
  )
}
