import { AddAlternativeCard } from '@/app/gjenbruksprodukter/rediger/AddAlternativeCard'
import { Button } from '@navikt/ds-react'
import { addAlternativeToGroup, AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import React from 'react'

type Props = {
  searchedProduct: AlternativeProduct
  alternativeGroup: string[]
  setTargetHmsArtNr: (hms: string | undefined) => void
  mutateAlternatives: (addedHmsArtNr?: string) => void
  // Callback to notify parent when an alternative has been successfully added
  onAdded?: () => void
}

export const AddAlternativeContent = ({
  alternativeGroup,
  searchedProduct,
  setTargetHmsArtNr,
  mutateAlternatives,
  onAdded,
}: Props) => {
  return (
    <>
      <AddAlternativeCard product={searchedProduct} />
      <Button
        size={'small'}
        onClick={() =>
          addAlternativeToGroup(alternativeGroup, searchedProduct.hmsArtNr!).then(() => {
            setTargetHmsArtNr(undefined)
            mutateAlternatives(searchedProduct.hmsArtNr!)
            // Inform parent so it can reset/close its UI
            onAdded?.()
          })
        }
        style={{ width: 'fit-content' }}
      >
        Legg til
      </Button>
    </>
  )
}
