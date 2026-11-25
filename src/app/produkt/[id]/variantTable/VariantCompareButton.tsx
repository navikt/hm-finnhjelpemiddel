'use client'

import { ALL_VARIANTS } from '@/app/sammenlign/compare-columns'

import { useState } from 'react'

import { ArrowRightLeftIcon } from '@navikt/aksel-icons'
import { Button, Popover } from '@navikt/ds-react'

import { CompareMenuState, MAX_PRODUCTS_TO_COMPARE, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product, ProductVariant } from '@/utils/product-util'

/** Legger én variant til eller fjerner den fra sammenligningen. Brukes i spesifikasjonstabellen på produktsiden. */
export const VariantCompareButton = ({ product, variant }: { product: Product; variant: ProductVariant }) => {
  const { productsToCompare, variantSelections, toggleVariantToCompare, setCompareMenuState } =
    useHydratedCompareStore()
  const [showPopover, setShowPopover] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const isProductInCompare = productsToCompare.some((prod) => prod.id === product.id)
  const selections = isProductInCompare ? (variantSelections[product.id] ?? [ALL_VARIANTS]) : []
  const isSelected = selections.includes(variant.id)

  const onClick = () => {
    if (!isProductInCompare && productsToCompare.length >= MAX_PRODUCTS_TO_COMPARE) {
      setShowPopover(true)
      return
    }
    if (!isSelected) setCompareMenuState(CompareMenuState.Open)
    toggleVariantToCompare(product, variant.id)
  }

  return (
    <>
      <Button
        ref={setAnchorEl}
        size="xsmall"
        variant={isSelected ? 'secondary' : 'tertiary'}
        icon={<ArrowRightLeftIcon aria-hidden />}
        onClick={onClick}
      >
        {isSelected ? 'Fjern fra sammenligning' : 'Legg til sammenligning'}
      </Button>
      <Popover open={showPopover} onClose={() => setShowPopover(false)} anchorEl={anchorEl}>
        <Popover.Content>Kan ikke sammenlikne mer enn {MAX_PRODUCTS_TO_COMPARE} produkter</Popover.Content>
      </Popover>
    </>
  )
}
