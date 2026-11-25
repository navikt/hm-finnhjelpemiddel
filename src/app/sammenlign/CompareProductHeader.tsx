'use client'

import { AddVariantCombobox } from '@/app/sammenlign/AddVariantCombobox'
import { CompareColumn, selectionOf } from '@/app/sammenlign/compare-columns'

import { MultiplyIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Button, Detail, HStack, VStack } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'

import ProductCardCompare from '@/components/ProductCardCompare'
import { NeutralTag } from '@/components/Tags'

import styles from './CompareTable.module.scss'

type Props = {
  product: Product
  columns: CompareColumn[]
  onAddSelection: (selection: string) => void
  onRemove: () => void
}

/** Sammenslått toppcelle for alle kolonner av samme produkt: produktkort og liste for å legge til varianter. */
export const CompareProductHeader = ({ product, columns, onAddSelection, onRemove }: Props) => {
  const hasMissingVariant = columns.some((column) => column.missingVariantId)

  return (
    <VStack gap="space-8">
      <ProductCardCompare product={product} type="removable" onRemove={onRemove} />
      {hasMissingVariant && (
        <Alert variant="warning" size="small">
          En valgt variant finnes ikke lenger. Fjern kolonnen med X-knappen i variantraden.
        </Alert>
      )}
      <AddVariantCombobox product={product} usedSelections={columns.map(selectionOf)} onAdd={onAddSelection} />
    </VStack>
  )
}

/** Overskrift for én kolonne under den sammenslåtte produktcellen. */
export const CompareVariantLabel = ({ column, onRemove }: { column: CompareColumn; onRemove: () => void }) => {
  const label = column.variant ? column.variant.articleName : column.missingVariantId ? 'variant' : 'alle varianter'
  return (
    <HStack gap="space-4" justify="space-between" align="start" wrap={false}>
      <VariantLabelContent column={column} />
      {/* Samme knapp som «Fjern produkt fra sammenligning» på produktkortet */}
      <Button
        variant="tertiary-neutral"
        className={styles.removeColumnButton}
        onClick={onRemove}
        icon={<MultiplyIcon title={`Fjern ${label} fra sammenligning`} />}
      />
    </HStack>
  )
}

const VariantLabelContent = ({ column }: { column: CompareColumn }) => {
  if (column.missingVariantId) {
    return <Detail textColor="subtle">Varianten finnes ikke lenger</Detail>
  }

  if (!column.variant) {
    return <BodyShort size="small">Alle varianter</BodyShort>
  }

  const { variant } = column

  return (
    <VStack gap="space-4">
      <BodyShort size="small" weight="semibold">
        {variant.articleName}
      </BodyShort>
      <Detail textColor="subtle">
        {variant.hmsArtNr ? `HMS ${variant.hmsArtNr}` : `Lev-artnr ${variant.supplierRef}`}
      </Detail>
      {variant.status === 'INACTIVE' && <NeutralTag>Utgått</NeutralTag>}
    </VStack>
  )
}
