'use client'

import { ALL_VARIANTS, sortedVariants, variantLabel } from '@/app/sammenlign/compare-columns'

import { useState } from 'react'

import { UNSAFE_Combobox } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'

type Props = {
  product: Product
  /** Valg som allerede har en kolonne (variant-id-er og/eller ALL_VARIANTS). Disse vises ikke i lista. */
  usedSelections: string[]
  onAdd: (selection: string) => void
}

/**
 * Søkbar nedtrekksliste som bare legger til kolonner. Feltet tømmes etter hvert valg.
 * Kolonner fjernes med X-knappen i variantraden.
 */
export const AddVariantCombobox = ({ product, usedSelections, onAdd }: Props) => {
  const [inputValue, setInputValue] = useState('')

  const options = [
    { label: `Alle varianter (${product.variants.length})`, value: ALL_VARIANTS },
    ...sortedVariants(product).map((v) => ({ label: variantLabel(v), value: v.id })),
  ].filter((option) => !usedSelections.includes(option.value))

  if (options.length === 0) return null

  return (
    <UNSAFE_Combobox
      label="Legg til variant"
      description={`Velg en variant av ${product.title} som skal få egen kolonne`}
      size="small"
      options={options}
      selectedOptions={[]}
      value={inputValue}
      onChange={setInputValue}
      onToggleSelected={(value, isSelected) => {
        if (!isSelected) return
        onAdd(value)
        setInputValue('')
      }}
    />
  )
}
