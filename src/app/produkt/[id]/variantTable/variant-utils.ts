import { ProductVariant } from '@/utils/product-util'
import { sortAlphabetically, sortIntWithStringFallback } from '@/utils/sort-util'
import { formatAgreementPosts, formatAgreementRanks } from '@/utils/string-util'
import { SortColumns } from '@/app/produkt/[id]/variantTable/VariantTable'

// Spesifikk rekkefølge av bestemte rader for Terskeleliminatorer med ISO 18301505.
// De radene som bør komme etter hverandre er: "Bredde",  "Terskelhøyde maks",  "Terskelhøyde min"

const customOrder = ['Belastning maks', 'Bredde', 'Terskelhøyde maks', 'Terskelhøyde min']

export const customSort = (a: string, b: string) => {
  const indexA = customOrder.indexOf(a)
  const indexB = customOrder.indexOf(b)

  if (indexA === -1 && indexB === -1) {
    return a.localeCompare(b)
  }
  if (indexA === -1) {
    return 1
  }
  if (indexB === -1) {
    return -1
  }
  return indexA - indexB
}

// Define the custom order for statuses
const statusOrder: { [key: string]: number } = {
  ACTIVE: 1,
  INACTIVE: 2,
}

export const sortColumnsByRowKey = (variants: ProductVariant[], sortColumns: SortColumns) => {
  return variants.sort((variantA, variantB) => {
    if (sortColumns.orderBy === 'HMS') {
      if (variantA.hmsArtNr && variantB.hmsArtNr) {
        return sortIntWithStringFallback(variantA.hmsArtNr, variantB.hmsArtNr, sortColumns?.direction === 'descending')
      }
      return -1
    }
    if (sortColumns.orderBy === 'levart') {
      if (variantA.supplierRef && variantB.supplierRef) {
        return sortAlphabetically(variantA.supplierRef, variantB.supplierRef, sortColumns?.direction === 'descending')
      }
      return -1
    }
    if (sortColumns.orderBy === 'Expired') {
      if (variantA.hasAgreement !== variantB.hasAgreement) {
        return variantA.hasAgreement ? -1 : 1
      }

      if (variantA.status !== variantB.status) {
        return statusOrder[variantA.status] - statusOrder[variantB.status]
      }

      return sortAlphabetically(
        variantA.articleName.trim().replace(/\s/g, ''),
        variantB.articleName.trim().replace(/\s/g, ''),
        sortColumns?.direction === 'descending'
      )
    }

    if (sortColumns.orderBy === 'rank') {
      if (variantA.agreements && variantA.agreements) {
        return sortAlphabetically(
          formatAgreementRanks(variantA.agreements!),
          formatAgreementRanks(variantB.agreements!),
          sortColumns?.direction === 'descending'
        )
      }
      return -1
    }
    if (sortColumns.orderBy === 'postNr') {
      if (variantA.agreements && variantA.agreements) {
        return sortAlphabetically(
          formatAgreementPosts(variantA.agreements!),
          formatAgreementPosts(variantB.agreements!),
          sortColumns?.direction === 'descending'
        )
      }
      return -1
    }
    if (sortColumns.orderBy === 'artName') {
      if (variantA.articleName && variantB.articleName) {
        return sortAlphabetically(
          variantA.articleName.trim().replace(/\s/g, ''),
          variantB.articleName.trim().replace(/\s/g, ''),
          sortColumns?.direction === 'descending'
        )
      }
      return -1
    }
    if (sortColumns.orderBy) {
      return sortIntWithStringFallback(
        variantA.techData[sortColumns.orderBy]?.value || '-',
        variantB.techData[sortColumns.orderBy]?.value || '-',
        sortColumns.direction === 'descending'
      )
    } else {
      return -1
    }
  })
}
