import { AddAlternativeCard } from '@/app/gjenbruksprodukter/rediger/AddAlternativeCard'
import { Button } from '@navikt/ds-react'
import { addAlternativeToGroup, AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'
import React from 'react'

type Props = {
  searchedProduct: AlternativeProduct
  alternativeGroup: string[]
  setNewAlternative: (alt: AlternativeProduct) => void
  setTargetHmsArtNr: (hms: string | undefined) => void
}

export const AddAlternativeContent = ({
  alternativeGroup,
  searchedProduct,
  setNewAlternative,
  setTargetHmsArtNr,
}: Props) => {
  return (
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
  )
}
