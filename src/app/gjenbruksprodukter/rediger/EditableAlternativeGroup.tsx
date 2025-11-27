import { VStack } from '@navikt/ds-react'
import React from 'react'
import { AlternativeProduct, deleteAlternativeFromGroup } from '@/app/gjenbruksprodukter/alternative-util'
import { EditableAlternativeCard } from '@/app/gjenbruksprodukter/rediger/EditableAlternativeCard'
import { AddAlternative } from '@/app/gjenbruksprodukter/rediger/AddAlternative'
import { NoAlternativesCard } from '@/app/gjenbruksprodukter/rediger/NoAlternativesCard'

export const EditableAlternativeGroup = ({
  originalProduct,
  alternatives,
  mutateAlternatives,
}: {
  originalProduct?: AlternativeProduct
  alternatives: AlternativeProduct[]
  mutateAlternatives: () => void
}) => {
  const baseGroup = alternatives.map((alternative) => alternative.hmsArtNr!).filter(Boolean)
  const alternativeGroup =
    baseGroup.length > 0
      ? baseGroup
      : originalProduct?.hmsArtNr
      ? [originalProduct.hmsArtNr]
      : []

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
        {orderedAlternatives.length === 1 && <NoAlternativesCard />}
      </VStack>
      <AddAlternative alternativeGroup={alternativeGroup} mutateAlternatives={mutateAlternatives} />
    </VStack>
  )
}
