import { Description } from '@/app/produkt/[id]/productInfo/GeneralProductInformation'
import { TechDataGroupTable } from '@/app/produkt/[id]/variantTable/TechDataGroupTable'
import { TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTableTest'

import React from 'react'

import { VStack } from '@navikt/ds-react'
import {
  TableBody,
  TableColumnHeader,
  TableDataCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@navikt/ds-react/Table'

import { getTechLabels } from '@/utils/api-util'
import { Product } from '@/utils/product-util'
import {
  findUniqueStringValues,
  formatAgreementPosts,
  formatAgreementRanks,
  toValueAndUnit,
  tryParseNumber,
} from '@/utils/string-util'
import { TechLabelDTO } from '@/utils/techlabel-util'

import ProductCardCompare from '@/components/ProductCardCompare'
import { Heading, Table } from '@/components/aksel-client'

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

  const productRowKeyValue = productsToCompare.reduce(
    (rowKeyValue, product) => {
      rowKeyValue[product.id] = allDataKeysVariants.reduce(
        (keysVariants, key) => {
          const values = product.variants
            .filter((variant) => key in variant.techData)
            .map((variant) => variant.techData[key].value)

          let unit = product.variants.find((p) => key in p.techData)?.techData[key].unit || ''

          let value = findValueRangeForProductRowKey(values)
          if (key.includes('intervall') && value === '0') {
            value = '-'
            unit = ''
          }

          keysVariants[key] = value ? (unit ? toValueAndUnit(value, unit) : value) : '-'
          return keysVariants
        },
        {} as Record<string, string>
      )
      return rowKeyValue
    },
    {} as Record<string, Record<string, string>>
  )

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
    <div className="compare-table-container">
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
        <TableBody>
          <TableRow>
            <TableHeaderCell className="side_header">Beskrivelse</TableHeaderCell>
            {productsToCompare.map((product) => {
              return (
                <TableDataCell key={product.id}>{<Description description={product.attributes.text} />}</TableDataCell>
              )
            })}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">Rangering</TableHeaderCell>
            {productsToCompare.map((product) => {
              return <TableDataCell key={product.id}>{formatAgreementRanks(product.agreements || [])}</TableDataCell>
            })}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">Delkontrakt</TableHeaderCell>
            {productsToCompare.map((product) => {
              return <TableDataCell key={product.id}>{formatAgreementPosts(product.agreements || [])}</TableDataCell>
            })}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">Antall varianter</TableHeaderCell>
            {productsToCompare.map((product) => (
              <TableDataCell key={product.id}>{product.variantCount}</TableDataCell>
            ))}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">HMS-nummer</TableHeaderCell>
            {productsToCompare.map((product) => (
              <TableDataCell key={product.id}>
                {product.variantCount > 1 ? 'Flere HMS-nummer' : product.variants[0].hmsArtNr}
              </TableDataCell>
            ))}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">Leverandør</TableHeaderCell>
            {productsToCompare.map((product) => (
              <TableDataCell key={product.id}>{product.supplierName}</TableDataCell>
            ))}
          </TableRow>
          <TableRow>
            <TableHeaderCell className="side_header">
              <Heading level="2" size="medium">
                Spesifikasjoner
              </Heading>
            </TableHeaderCell>
            {<TableDataCell colSpan={productsToCompare.length + 1}></TableDataCell>}
          </TableRow>
          <VStack>
            {groupedTechDataRows
              .sort((a, b) => a.priority - b.priority)
              .map(({ title, techDataRows }) => (
                <TechDataGroupTable title={title} techDataRows={techDataRows} key={title} />
              ))}
          </VStack>
        </TableBody>
      </Table>
    </div>
  )
}
