import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button, ExpansionCard, Search, VStack } from '@navikt/ds-react'
import { AlternativeProduct, createAlternativeMapping } from '@/app/gjenbruksprodukter/alternative-util'
import useSWRImmutable from 'swr/immutable'
import { Product } from '@/utils/product-util'
import { getProductFromHmsArtNrs } from '@/utils/api-util'
import { AddAlternativeCard } from '@/app/gjenbruksprodukter/AddAlternativeCard'
import { mapToAlternativeProduct } from '@/app/gjenbruksprodukter/AlternativeProductsList'

export const AddAlternative = ({
  alternativeGroup,
  setNewAlternative,
}: {
  alternativeGroup: string[]
  setNewAlternative: Dispatch<SetStateAction<AlternativeProduct | undefined>>
}) => {
  const [targetHmsArtNr, setTargetHmsArtNr] = useState<string | undefined>(undefined)

  const {
    data: searchedProduct,
    isLoading,
    error,
  } = useSWRImmutable<Product[]>(targetHmsArtNr ? targetHmsArtNr : null, () =>
    getProductFromHmsArtNrs([targetHmsArtNr!])
  )

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
            {searchedProduct?.length === 1 && (
              <>
                <AddAlternativeCard product={searchedProduct[0]} />
                <Button
                  size={'small'}
                  onClick={() =>
                    createAlternativeMapping(sourceHmsArtNr, searchedProduct[0].variants[0].hmsArtNr!).then(() => {
                      setNewAlternative(mapToAlternativeProduct(searchedProduct[0], undefined))
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
