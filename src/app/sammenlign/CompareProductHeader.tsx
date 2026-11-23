'use client'

import { ALL_VARIANTS, CompareColumn, columnRank, sortedVariants, variantLabel } from '@/app/sammenlign/compare-columns'

import { Alert, BodyShort, Detail, UNSAFE_Combobox, VStack } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'

import ProductCardCompare from '@/components/ProductCardCompare'
import { NeutralTag } from '@/components/Tags'

type Props = {
  product: Product
  columns: CompareColumn[]
  onToggleSelection: (selection: string, isSelected: boolean) => void
  onRemove: () => void
}

/** Sammenslått toppcelle for alle kolonner av samme produkt: produktkort og flervalg av varianter. */
export const CompareProductHeader = ({ product, columns, onToggleSelection, onRemove }: Props) => {
  const allOption = { label: `Alle varianter (${product.variants.length})`, value: ALL_VARIANTS }
  const options = [allOption, ...sortedVariants(product).map((v) => ({ label: variantLabel(v), value: v.id }))]

  const selectedOptions = columns
    .filter((column) => !column.missingVariantId)
    .map((column) => (column.variant ? options.find((option) => option.value === column.variant!.id)! : allOption))

  const hasMissingVariant = columns.some((column) => column.missingVariantId)

  return (
    <VStack gap="space-8">
      <ProductCardCompare product={product} type="removable" onRemove={onRemove} />
      {hasMissingVariant && (
        <Alert variant="warning" size="small">
          En valgt variant finnes ikke lenger. Velg en annen variant.
        </Alert>
      )}
      <UNSAFE_Combobox
        label="Varianter"
        description={`Velg hvilke varianter av ${product.title} du vil sammenligne`}
        size="small"
        isMultiSelect
        options={options}
        selectedOptions={selectedOptions}
        onToggleSelected={onToggleSelection}
      />
    </VStack>
  )
}

/** Overskrift for én kolonne under den sammenslåtte produktcellen. */
export const CompareVariantLabel = ({ column }: { column: CompareColumn }) => {
  if (column.missingVariantId) {
    return <Detail textColor="subtle">Varianten finnes ikke lenger</Detail>
  }

  if (!column.variant) {
    return <BodyShort size="small">Alle varianter</BodyShort>
  }

  const { variant } = column
  const rank = columnRank(column)

  return (
    <VStack gap="space-4">
      <BodyShort size="small" weight="semibold">
        {variant.articleName}
      </BodyShort>
      <Detail textColor="subtle">
        {variant.hmsArtNr ? `HMS ${variant.hmsArtNr}` : `Lev-artnr ${variant.supplierRef}`}
      </Detail>
      {rank !== undefined && rank !== Infinity && (
        <Detail textColor="subtle">{rank < 90 ? `Rangering ${rank}` : 'På avtale med Nav'}</Detail>
      )}
      {variant.status === 'INACTIVE' && <NeutralTag>Utgått</NeutralTag>}
    </VStack>
  )
}
