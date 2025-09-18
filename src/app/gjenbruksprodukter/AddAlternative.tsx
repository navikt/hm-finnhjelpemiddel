import React, { useState } from 'react'
import { Box, Button, HGrid, Search, VStack } from '@navikt/ds-react'
import { createAlternativeMapping } from '@/app/gjenbruksprodukter/alternative-util'
import styles from './AddAlternative.module.scss'
import useSWRImmutable from 'swr/immutable'
import { Product } from '@/utils/product-util'
import { getProductFromHmsArtNrs } from '@/utils/api-util'
import { AddAlternativeCard } from '@/app/gjenbruksprodukter/AddAlternativeCard'

export const AddAlternative = ({
  sourceHmsArtNr,
  mutateAlternatives,
}: {
  sourceHmsArtNr: string
  mutateAlternatives: () => void
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
    <Box asChild paddingBlock={'8 6'} paddingInline={'8'} className={styles.wrapper}>
      <HGrid gap={'2'} columns={'1fr 2fr'}>
        <Search
          label="Søk"
          hideLabel={true}
          variant="primary"
          onSearchClick={setTargetHmsArtNr}
          onClear={() => setTargetHmsArtNr(undefined)}
          htmlSize={'12'}
        />
        {searchedProduct?.length === 1 && (
          <VStack>
            <AddAlternativeCard product={searchedProduct[0]} />
            <Button
              onClick={() =>
                createAlternativeMapping(sourceHmsArtNr, searchedProduct[0].variants[0].hmsArtNr!).then(() =>
                  mutateAlternatives()
                )
              }
              style={{ width: 'fit-content' }}
            >
              Legg til
            </Button>
          </VStack>
        )}
      </HGrid>
    </Box>
  )
}
