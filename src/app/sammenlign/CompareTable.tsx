import { TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTableTest'
import { CompareMetaDataTable } from '@/app/sammenlign/CompareMetaDataTable'
import { CompareTechDataGroupTable } from '@/app/sammenlign/CompareTechDataGroupTable'

import React from 'react'

import { VStack } from '@navikt/ds-react'
import { TableColumnHeader, TableHeader, TableRow } from '@navikt/ds-react/Table'

import { getTechLabels } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import { findUniqueStringValues, tryParseNumber } from '@/utils/string-util'
import { TechLabelDTO } from '@/utils/techlabel-util'

import ProductCardCompare from '@/components/ProductCardCompare'
import { Table } from '@/components/aksel-client'

import styles from './CompareTable.module.scss'

export const CompareTable = async ({ productsToCompare }: { productsToCompare: Product[] }) => {
  const isos = [...new Set(productsToCompare.map((product) => product.isoCategory))]
  const techLabels = (await Promise.all(isos.map((iso) => getTechLabels(iso)))).flat()

  const allDataKeysVariants = [
    ...new Set(
      productsToCompare.flatMap((product) => product.variants.flatMap((variant) => Object.keys(variant.techData)))
    ),
  ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  const findValueRangeForProductRowKey = (values: string[]) => {
    if (values.length === 0) return

    if (values.some((value) => isNaN(tryParseNumber(value)))) {
      return findUniqueStringValues(values)
    }

    const numberList = values.map(tryParseNumber)
    const min = Math.min(...numberList)
    const max = Math.max(...numberList)
    if (min === max) return String(min)
    return `${min} - ${max}`
  }

  const techDataRowsAll: TechDataRow[] = allDataKeysVariants.map((key) => {
    return {
      key: key,
      values: productsToCompare.map((product) => {
        const variantValues = product.variants
          .filter((variant) => key in variant.techData)
          .map((variant) => variant.techData[key].value)

        return findValueRangeForProductRowKey(variantValues)
      }),
      unit: productsToCompare[0].variants.find((variant) => variant.techData[key] !== undefined)?.techData[key].unit,
      type:
        productsToCompare[0].variants.find((variant) => variant.techData[key] !== undefined)?.techData[key].type ?? '',
    } as TechDataRow
  })

  type TechDataSection = {
    title: string
    priority: number
    techDataRows: TechDataRow[]
  }

  const groupTechDataRowsBySection = (techDataRows: TechDataRow[], techLabels: TechLabelDTO[]): TechDataSection[] => {
    const rowsBySection = new Map<string, TechDataSection>()

    techDataRows.forEach((techDataRow) => {
      const techLabel = techLabels.find((techLabel) => techLabel.label === techDataRow.key)
      const sectionTitle = techLabel?.section ?? 'Diverse'

      if (!rowsBySection.has(sectionTitle)) {
        rowsBySection.set(sectionTitle, {
          title: sectionTitle,
          priority: sectionTitle == 'Diverse' || !techLabel ? 1000 : techLabel.sort,
          techDataRows: [],
        })
      }
      const section = rowsBySection.get(sectionTitle)!
      if (techLabel && techLabel.section && techLabel.sort < section.priority) {
        section.priority = techLabel.sort
      }
      section.techDataRows.push(techDataRow)
    })

    return rowsBySection.values().toArray()
  }

  const groupedTechDataRows = groupTechDataRowsBySection(techDataRowsAll, techLabels)

  return (
    <VStack className={styles.compareTable} width={'100%'}>
      <Table zebraStripes>
        <TableHeader>
          <TableRow>
            <TableColumnHeader className="common_headercell"></TableColumnHeader>
            {productsToCompare.map((product) => (
              <TableColumnHeader className="header" key={'id-' + product.id}>
                <ProductCardCompare product={product} type="removable" />
              </TableColumnHeader>
            ))}
          </TableRow>
        </TableHeader>
      </Table>
      <CompareMetaDataTable productsToCompare={productsToCompare} />
      {groupedTechDataRows
        .sort((a, b) => a.priority - b.priority)
        .map(({ title, techDataRows }) => (
          <CompareTechDataGroupTable
            title={title}
            techDataRows={techDataRows}
            productCount={productsToCompare.length}
            key={title}
          />
        ))}
    </VStack>
  )
}
