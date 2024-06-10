import { ProductVariant } from '@/utils/product-util'
import { sortAlphabetically, sortIntWithStringFallback } from '@/utils/sort-util'
import { formatAgreementRanks } from '@/utils/string-util'
import { SortColumns } from './ProductVariants'

export const hasDifferentValues = ({ row }: { row: string[] }) => {
  let uniqueValues = new Set(row)
  uniqueValues.delete('-')
  return uniqueValues.size > 1
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
    if (
      sortColumns.orderBy &&
      variantA.techData[sortColumns.orderBy]?.value &&
      variantB.techData[sortColumns.orderBy]?.value
    ) {
      return sortIntWithStringFallback(
        variantA.techData[sortColumns.orderBy].value,
        variantB.techData[sortColumns.orderBy].value,
        sortColumns.direction === 'descending'
      )
    } else return -1
  })
}

export const egenskaperText = (
  title: string,
  variantCount: number,
  numberOfvariantsOnAgreement: number,
  numberOfvariantsWithoutAgreement: number
): string => {
  const allVariantsOnAgreement = `${title} finnes i ${numberOfvariantsOnAgreement} ${
    numberOfvariantsOnAgreement === 1 ? 'variant' : 'varianter'
  } på avtale med NAV.`
  const variantsWithAndWithoutAgreement =
    numberOfvariantsOnAgreement === 0
      ? `${title} finnes i ${numberOfvariantsWithoutAgreement} ${
          numberOfvariantsWithoutAgreement === 1 ? 'variant' : 'varianter'
        }.`
      : `${title} finnes i ${numberOfvariantsOnAgreement} varianter på avtale med NAV, og ${numberOfvariantsWithoutAgreement} ${
          numberOfvariantsWithoutAgreement === 1 ? 'variant' : 'varianter'
        } som ikke er på avtale med NAV.`

  const textMultipleVariants =
    'Nedenfor finner man en oversikt over egenskapene til de forskjellige variantene. Radene der egenskapene har ulike verdier kan sorteres.'
  const textOnlyOne = 'Nedenfor finner man en oversikt over egenskaper.'

  return `${
    numberOfvariantsWithoutAgreement > 0 ? variantsWithAndWithoutAgreement : allVariantsOnAgreement
  } ${variantCount === 1 ? textOnlyOne : textMultipleVariants}`
}
