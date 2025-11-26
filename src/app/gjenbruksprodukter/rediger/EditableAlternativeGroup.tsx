import { VStack } from '@navikt/ds-react'
import React from 'react'
import { AlternativeProduct, deleteAlternativeFromGroup } from '@/app/gjenbruksprodukter/alternative-util'
import { EditableAlternativeCard } from '@/app/gjenbruksprodukter/rediger/EditableAlternativeCard'
import { AddAlternative } from '@/app/gjenbruksprodukter/rediger/AddAlternative'

export const EditableAlternativeGroup = ({
  originalProduct,
  alternatives,
  mutateAlternatives,
}: {
  originalProduct?: AlternativeProduct
  alternatives: AlternativeProduct[]
  mutateAlternatives: () => void
}) => {
  const alternativeGroup = alternatives.map((alternative) => alternative.hmsArtNr!)

  const others = alternatives
    .filter((alt) => !originalProduct || alt.variantId !== originalProduct.variantId)
    .sort((a, b) => a.highestRank - b.highestRank)

  const orderedAlternatives = originalProduct ? [originalProduct, ...others] : others

  return (
    <VStack gap={'2'}>
      <VStack>
        {orderedAlternatives.map((alternative) => (
          <EditableAlternativeCard
            alternativeProduct={alternative}
            isOriginal={!!originalProduct && alternative.variantId === originalProduct.variantId}
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
