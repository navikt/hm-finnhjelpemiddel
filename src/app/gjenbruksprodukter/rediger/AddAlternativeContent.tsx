import { AddAlternativeCard } from '@/app/gjenbruksprodukter/rediger/AddAlternativeCard'
import { Button } from '@navikt/ds-react'
import { addAlternativeToGroup, AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import React from 'react'

type Props = {
  searchedProduct: AlternativeProduct
  alternativeGroup: string[]
  setTargetHmsArtNr: (hms: string | undefined) => void
  mutateAlternatives: () => void
}

export const AddAlternativeContent = ({
  alternativeGroup,
  searchedProduct,
  setTargetHmsArtNr,
  mutateAlternatives,
}: Props) => {
  return (
    <>
      <AddAlternativeCard product={searchedProduct} />
      <Button
        size={'small'}
        onClick={() =>
          addAlternativeToGroup(alternativeGroup, searchedProduct.hmsArtNr!).then(() => {
            setTargetHmsArtNr(undefined)
            mutateAlternatives()
          })
        }
        style={{ width: 'fit-content' }}
      >
        Legg til
      </Button>
    </>
  )
}
