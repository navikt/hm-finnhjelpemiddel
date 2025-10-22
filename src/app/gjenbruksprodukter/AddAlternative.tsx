import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button, ExpansionCard, Search, VStack } from '@navikt/ds-react'
import {
  addAlternativeToGroup,
  AlternativeProduct,
  AlternativeStockResponseNew,
  newGetAlternatives,
} from '@/app/gjenbruksprodukter/alternative-util'
import useSWRImmutable from 'swr/immutable'
import { AddAlternativeCard } from '@/app/gjenbruksprodukter/AddAlternativeCard'

export const AddAlternative = ({
  alternativeGroup,
  setNewAlternative,
}: {
  alternativeGroup: string[]
  setNewAlternative: Dispatch<SetStateAction<AlternativeProduct | undefined>>
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
            />
            {searchedProduct && (
              <>
                <AddAlternativeCard product={searchedProduct} />
                <Button
                  size={'small'}
                  onClick={() =>
                    addAlternativeToGroup(alternativeGroup, searchedProduct.hmsArtNr!).then(() => {
                      setNewAlternative(searchedProduct)
                      setTargetHmsArtNr(undefined)
                    })
                  }
                  style={{ width: 'fit-content' }}
                >
                  Legg til
                </Button>
              </>
            )}
          </VStack>
        </ExpansionCard.Content>
      </ExpansionCard>
    </VStack>
  )
}
