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
    const selections = selectionsByProduct.get(product.id) ?? [ALL_VARIANTS]

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

/** Skriver kolonnene tilbake til URL-parametere. Standardoppsettet gir rene lenker uten kolonne-parametere. */
export const columnsToSearchParams = (current: URLSearchParams, columns: CompareColumn[]): URLSearchParams => {
  const params = new URLSearchParams(current.toString())
  params.delete(PRODUCT_PARAM)
  params.delete(COLUMN_PARAM)

  const productIds = [...new Set(columns.map((column) => column.product.id))]
  productIds.forEach((id) => params.append(PRODUCT_PARAM, id))

  const isDefault =
    columns.length === productIds.length && columns.every((column) => selectionOf(column) === ALL_VARIANTS)

  if (!isDefault) {
    columns.forEach((column) => params.append(COLUMN_PARAM, toParamValue(column.product.id, selectionOf(column))))
  }

  return params
}

export const sortedVariants = (product: Product): ProductVariant[] =>
  sortColumnsByRowKey([...product.variants], { orderBy: 'Expired', direction: 'ascending' })

export const variantLabel = (variant: ProductVariant): string => {
  const id = variant.hmsArtNr ? `HMS ${variant.hmsArtNr}` : `Lev-artnr ${variant.supplierRef}`
  const status = variant.status === 'INACTIVE' ? ' · Utgått' : ''
  return `${variant.articleName} · ${id}${status}`
}

export const columnRank = (column: CompareColumn): number | undefined => {
  if (!column.variant) return undefined
  // Tom liste gir Infinity, som ProductCardCompare tolker som «ikke på avtale»
  return Math.min(...column.variant.agreements.map((agreement) => agreement.rank))
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
