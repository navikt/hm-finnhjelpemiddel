import { VStack } from '@navikt/ds-react'
import React, { useState } from 'react'
import { AlternativeProduct, deleteAlternativeFromGroup } from '@/app/gjenbruksprodukter/alternative-util'
import { EditableAlternativeCard } from '@/app/gjenbruksprodukter/rediger/EditableAlternativeCard'
import { AddAlternative } from '@/app/gjenbruksprodukter/rediger/AddAlternative'

export const EditableAlternativeGroup = ({
  alternatives,
  mutateAlternatives,
}: {
  alternatives: AlternativeProduct[]
  mutateAlternatives: () => void
}) => {
  const [newAlternative, setNewAlternative] = useState<AlternativeProduct | undefined>(undefined)

  const alternativeGroup = alternatives.map((alternative) => alternative.hmsArtNr!)

  return (
    <VStack gap={'2'}>
      <VStack>
        {alternatives
          .sort((a, b) => a.highestRank - b.highestRank)
          .map((alternative) => (
            <EditableAlternativeCard
              alternativeProduct={alternative}
              onDelete={() =>
                deleteAlternativeFromGroup(alternativeGroup, alternative.hmsArtNr!).then(() => mutateAlternatives())
              }
              key={alternative.variantId}
            />
          ))}
        {newAlternative && (
          <EditableAlternativeCard
            alternativeProduct={newAlternative}
            onDelete={() =>
              deleteAlternativeFromGroup(alternativeGroup, newAlternative.hmsArtNr!).then(() =>
                setNewAlternative(undefined)
              )
            }
            key={newAlternative.variantId}
          />
        )}
      </VStack>
      <AddAlternative alternativeGroup={alternativeGroup} setNewAlternative={setNewAlternative} />
    </VStack>
  )
}
