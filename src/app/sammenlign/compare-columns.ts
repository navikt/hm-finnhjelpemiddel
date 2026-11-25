import type { TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTable'
import { sortColumnsByRowKey } from '@/app/produkt/[id]/variantTable/variant-utils'

import { Product, ProductVariant } from '@/utils/product-util'
import { findUniqueStringValues, tryParseNumber } from '@/utils/string-util'

export const ALL_VARIANTS = 'alle'
export const COLUMN_PARAM = 'kolonne'
export const PRODUCT_PARAM = 'id'

/**
 * En kolonne i sammenligningen. Et produkt kan ha flere kolonner: «Alle varianter» og/eller enkeltvarianter.
 * - variant === null og missingVariantId === undefined: alle varianter (samme beregning som før)
 * - variant !== null: én bestemt variant
 * - missingVariantId satt: lenken peker på en variant som ikke finnes lenger
 */
export type CompareColumn = {
  key: string
  product: Product
  variant: ProductVariant | null
  missingVariantId?: string
}

export const selectionOf = (column: Pick<CompareColumn, 'variant' | 'missingVariantId'>) =>
  column.variant?.id ?? column.missingVariantId ?? ALL_VARIANTS

const toParamValue = (productId: string, selection: string) => `${productId}:${selection}`

const parseParamValue = (value: string): { productId: string; selection: string } | undefined => {
  const separator = value.lastIndexOf(':')
  if (separator <= 0 || separator === value.length - 1) return undefined
  return { productId: value.slice(0, separator), selection: value.slice(separator + 1) }
}

/**
 * Bygger kolonnene fra URL-en. Uten kolonne-parametere får hvert produkt én «Alle varianter»-kolonne,
 * slik at eksisterende lenker virker som før. Kolonner grupperes per produkt i produktrekkefølgen.
 */
export const parseColumns = (products: Product[], columnParams: string[]): CompareColumn[] => {
  const selectionsByProduct = new Map<string, string[]>()

  columnParams.forEach((param) => {
    const parsed = parseParamValue(param)
    if (!parsed) return
    const selections = selectionsByProduct.get(parsed.productId) ?? []
    if (!selections.includes(parsed.selection)) {
      selections.push(parsed.selection)
    }
    selectionsByProduct.set(parsed.productId, selections)
  })

  return products.flatMap((product) => {
    const selections = [...(selectionsByProduct.get(product.id) ?? [ALL_VARIANTS])]
      // «Alle varianter» står alltid først, før enkeltvariantene
      .sort((a, b) => Number(b === ALL_VARIANTS) - Number(a === ALL_VARIANTS))

    return selections.map((selection): CompareColumn => {
      const key = toParamValue(product.id, selection)
      if (selection === ALL_VARIANTS) {
        return { key, product, variant: null }
      }
      const variant = product.variants.find((v) => v.id === selection)
      return variant ? { key, product, variant } : { key, product, variant: null, missingVariantId: selection }
    })
  })
}

/**
 * Lager URL-parametere for sammenligningen. Uten valgte varianter (bare «Alle varianter» per produkt)
 * får lenken ingen kolonne-parametere, slik at den ser ut som før.
 */
export const selectionsToSearchParams = (
  current: URLSearchParams,
  productIds: string[],
  selectionsByProduct: Record<string, string[] | undefined>
): URLSearchParams => {
  const params = new URLSearchParams(current.toString())
  params.delete(PRODUCT_PARAM)
  params.delete(COLUMN_PARAM)

  productIds.forEach((id) => params.append(PRODUCT_PARAM, id))

  const selections = productIds.map((id) => {
    const selected = selectionsByProduct[id]
    return { id, selected: selected && selected.length > 0 ? selected : [ALL_VARIANTS] }
  })
  const isDefault = selections.every(({ selected }) => selected.length === 1 && selected[0] === ALL_VARIANTS)

  if (!isDefault) {
    selections.forEach(({ id, selected }) =>
      selected.forEach((selection) => params.append(COLUMN_PARAM, toParamValue(id, selection)))
    )
  }

  return params
}

export const groupSelectionsByProduct = (columns: CompareColumn[]): Record<string, string[]> =>
  columns.reduce<Record<string, string[]>>((acc, column) => {
    acc[column.product.id] = [...(acc[column.product.id] ?? []), selectionOf(column)]
    return acc
  }, {})

/** Skriver kolonnene tilbake til URL-parametere. */
export const columnsToSearchParams = (current: URLSearchParams, columns: CompareColumn[]): URLSearchParams =>
  selectionsToSearchParams(
    current,
    [...new Set(columns.map((column) => column.product.id))],
    groupSelectionsByProduct(columns)
  )

export const sortedVariants = (product: Product): ProductVariant[] =>
  sortColumnsByRowKey([...product.variants], { orderBy: 'Expired', direction: 'ascending' })

export const variantLabel = (variant: ProductVariant): string => {
  const status = variant.status === 'INACTIVE' ? ' · Utgått' : ''
  return `${variant.articleName}${status}`
}

const variantsInColumn = (column: CompareColumn): ProductVariant[] => {
  if (column.variant) return [column.variant]
  if (column.missingVariantId) return []
  return column.product.variants
}

const findValueRange = (values: string[]): string | undefined => {
  if (values.length === 0) return undefined
  if (values.length === 1) return values[0]

  if (values.some((value) => isNaN(tryParseNumber(value)))) {
    return findUniqueStringValues(values)
  }

  const numberList = values.map(tryParseNumber)
  const min = Math.min(...numberList)
  const max = Math.max(...numberList)
  if (min === max) return String(min)
  return `${min} - ${max}`
}

export const buildTechDataRows = (columns: CompareColumn[]): TechDataRow[] => {
  const allVariants = columns.flatMap(variantsInColumn)

  const keys = [...new Set(allVariants.flatMap((variant) => Object.keys(variant.techData)))].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  )

  return keys.map(
    (key) =>
      ({
        key,
        values: columns.map((column) =>
          findValueRange(
            variantsInColumn(column)
              .filter((variant) => key in variant.techData)
              .map((variant) => variant.techData[key].value)
          )
        ),
        unit: allVariants.find((variant) => variant.techData[key]?.unit !== undefined)?.techData[key].unit,
        type: allVariants.find((variant) => variant.techData[key]?.type !== undefined)?.techData[key].type ?? '',
      }) as TechDataRow
  )
}

export type ProductGroup = { product: Product; columns: CompareColumn[] }

/** Kolonnene er gruppert per produkt (se parseColumns), så hvert produkt kan få sammenslåtte celler. */
export const groupColumnsByProduct = (columns: CompareColumn[]): ProductGroup[] =>
  columns.reduce<ProductGroup[]>((groups, column) => {
    const last = groups.at(-1)
    if (last?.product.id === column.product.id) {
      last.columns.push(column)
    } else {
      groups.push({ product: column.product, columns: [column] })
    }
    return groups
  }, [])

/** Indeksene til kolonner som starter et nytt hjelpemiddel (ikke den første). Brukes til skillelinjer. */
export const productBoundaryIndices = (columns: CompareColumn[]): number[] =>
  columns.flatMap((column, index) => (index > 0 && columns[index - 1].product.id !== column.product.id ? [index] : []))
