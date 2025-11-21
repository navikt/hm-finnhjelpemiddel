import { VStack } from '@navikt/ds-react'
import React from 'react'
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
      </VStack>
      <AddAlternative alternativeGroup={alternativeGroup} mutateAlternatives={mutateAlternatives} />
    </VStack>
  )
}
