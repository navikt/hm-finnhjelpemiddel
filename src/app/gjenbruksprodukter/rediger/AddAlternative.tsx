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
  mutateAlternatives: () => void
}) => {
  const [targetHmsArtNr, setTargetHmsArtNr] = useState<string | undefined>(undefined)

  const {
    data: alternativeResponse,
    isLoading,
    error,
  } = useSWRImmutable<AlternativeStockResponseNew | undefined>(targetHmsArtNr ? targetHmsArtNr : null, () =>
    newGetAlternatives(targetHmsArtNr!)
  )

  const searchedProduct = alternativeResponse?.original
  const searchedHmsArtNr = searchedProduct?.hmsArtNr ?? undefined

  const isAlreadyInGroup = useMemo(
    () => !!searchedHmsArtNr && alternativeGroup.includes(searchedHmsArtNr),
    [searchedHmsArtNr, alternativeGroup]
  )

  const unknownHmsNr = targetHmsArtNr && !isLoading && !searchedProduct

  return (
    <VStack gap={'4'}>
      <ExpansionCard size={'small'} aria-label="Demo med bare tittel" style={{ width: '410px' }}>
        <ExpansionCard.Header>
          <ExpansionCard.Title size={'small'}>Legg til alternativ</ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <VStack gap={'2'} padding={'2'}>
            <Search
              label="Skriv HMS-nummer"
              hideLabel={false}
              variant="primary"
              onSearchClick={setTargetHmsArtNr}
              onKeyUp={(event: React.KeyboardEvent) => {
                if (event.key === 'Enter') {
                  setTargetHmsArtNr((event.currentTarget as HTMLInputElement).value)
                }
              }}
              onClear={() => setTargetHmsArtNr(undefined)}
              htmlSize={'12'}
              error={
                (unknownHmsNr && 'Finner ikke hjelpemiddelet') ||
                (isAlreadyInGroup && 'Produktet er allerede i denne alternativgruppen')
              }
            />
            {targetHmsArtNr && searchedProduct && !isAlreadyInGroup && (
              <AddAlternativeContent
                searchedProduct={searchedProduct}
                alternativeGroup={alternativeGroup}
                setTargetHmsArtNr={setTargetHmsArtNr}
                mutateAlternatives={mutateAlternatives}
              />
            )}
          </VStack>
        </ExpansionCard.Content>
      </ExpansionCard>
    </VStack>
  )
}
