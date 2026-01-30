import React, { useMemo, useState } from 'react'
import { ExpansionCard, Search, VStack } from '@navikt/ds-react'
import { AlternativeStockResponseNew, newGetAlternatives } from '@/app/gjenbruksprodukter/alternative-util'
import useSWRImmutable from 'swr/immutable'
import { AddAlternativeContent } from '@/app/gjenbruksprodukter/rediger/AddAlternativeContent'

export const AddAlternative = ({
  alternativeGroup,
  mutateAlternatives,
}: {
  alternativeGroup: string[]
  mutateAlternatives: (addedHmsArtNr?: string) => void
}) => {
  const [targetHmsArtNr, setTargetHmsArtNr] = useState<string | undefined>(undefined)
  // Control whether the expansion card is open so we can close it after adding
  const [isOpen, setIsOpen] = useState(false)

  const {
    data: alternativeResponse,
    isLoading,
  } = useSWRImmutable<AlternativeStockResponseNew | undefined>(targetHmsArtNr ? targetHmsArtNr : null, () =>
    newGetAlternatives(targetHmsArtNr!)
  )

  const searchedProduct = alternativeResponse?.original
  const searchedHmsArtNr = searchedProduct?.hmsArtNr ?? undefined

  // Check if the searched product is already part of the current alternative group
  const isAlreadyInGroup = useMemo(
    () => !!searchedHmsArtNr && alternativeGroup.includes(searchedHmsArtNr),
    [searchedHmsArtNr, alternativeGroup]
  )

  const unknownHmsNr = targetHmsArtNr && !isLoading && !searchedProduct

  const handleAlternativeAdded = () => {
    // Reset search and close the expansion card after a successful add
    setTargetHmsArtNr(undefined)
    setIsOpen(false)
  }

  return (
    <VStack gap={"space-16"}>
      <ExpansionCard
        size={'small'}
        aria-label="Demo med bare tittel"
        style={{ width: '410px' }}
        open={isOpen}
        onToggle={setIsOpen}
      >
        <ExpansionCard.Header>
          <ExpansionCard.Title size={'small'}>Legg til alternativ</ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <VStack gap={"space-8"} padding={"space-8"}>
            <Search
              label="Skriv HMS-nummer"
              hideLabel={false}
              variant="primary"
              onSearchClick={(value) => {
                setTargetHmsArtNr(value)
                // Open card when a search is performed so content is visible
                setIsOpen(true)
              }}
              onKeyUp={(event: React.KeyboardEvent) => {
                if (event.key === 'Enter') {
                  const value = (event.currentTarget as HTMLInputElement).value
                  setTargetHmsArtNr(value)
                  setIsOpen(true)
                }
              }}
              onClear={() => setTargetHmsArtNr(undefined)}
              htmlSize={'12'}
              error={
                (unknownHmsNr && 'Finner ikke hjelpemiddelet') ||
                (isAlreadyInGroup && 'Produktet er allerede i denne klyngen med alternativer')
              }
            />
            {/* Only show AddAlternativeContent when we have a product AND it is not already in the group */}
            {targetHmsArtNr && searchedProduct && !isAlreadyInGroup && (
              <AddAlternativeContent
                searchedProduct={searchedProduct}
                alternativeGroup={alternativeGroup}
                setTargetHmsArtNr={setTargetHmsArtNr}
                mutateAlternatives={mutateAlternatives}
                // Notify parent so it can reset search state and close card
                onAdded={handleAlternativeAdded}
              />
            )}
          </VStack>
        </ExpansionCard.Content>
      </ExpansionCard>
    </VStack>
  );
}
