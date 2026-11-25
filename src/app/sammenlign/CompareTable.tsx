'use client'

import type { TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTable'
import { CompareColGroup } from '@/app/sammenlign/CompareColGroup'
import { CompareMetaDataTable } from '@/app/sammenlign/CompareMetaDataTable'
import { CompareProductHeader, CompareVariantLabel } from '@/app/sammenlign/CompareProductHeader'
import { CompareTechDataSections } from '@/app/sammenlign/CompareTechDataSections'
import type { TechDataSection } from '@/app/sammenlign/CompareTechDataSections'
import {
  ALL_VARIANTS,
  COLUMN_PARAM,
  CompareColumn,
  PRODUCT_PARAM,
  buildTechDataRows,
  columnsToSearchParams,
  groupColumnsByProduct,
  groupSelectionsByProduct,
  parseColumns,
  productBoundaryIndices,
  selectionOf,
} from '@/app/sammenlign/compare-columns'

import React, { useMemo } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'

import classNames from 'classnames'

import { BodyShort, Link, VStack } from '@navikt/ds-react'
import { TableBody, TableColumnHeader, TableDataCell, TableRow } from '@navikt/ds-react/Table'

import { useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { TechLabelDTO } from '@/utils/techlabel-util'

import { Table } from '@/components/aksel-client'

import styles from './CompareTable.module.scss'

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

  return [...rowsBySection.values()]
}

export const CompareTable = ({
  productsToCompare,
  techLabels,
  techLabels22,
}: {
  productsToCompare: Product[]
  techLabels: TechLabelDTO[]
  techLabels22: TechLabelDTO[]
}) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { removeProduct, productsToCompare: productsInMenu, setVariantSelections } = useHydratedCompareStore()

  // Produktene hentes på serveren. Endringer i kolonner skjer bare i URL-en, så vi slipper ny henting.
  const productIds = searchParams.getAll(PRODUCT_PARAM)
  const columnParams = searchParams.getAll(COLUMN_PARAM)

  const columns = useMemo(
    () =>
      parseColumns(
        productsToCompare.filter((product) => productIds.includes(product.id)),
        columnParams
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productsToCompare, productIds.join(','), columnParams.join(',')]
  )

  const techDataRows = useMemo(() => buildTechDataRows(columns), [columns])
  const groupedTechDataRows = useMemo(
    () => groupTechDataRowsBySection(techDataRows, techLabels),
    [techDataRows, techLabels]
  )
  const groupedTechDataRows22 = useMemo(
    () => groupTechDataRowsBySection(techDataRows, techLabels22),
    [techDataRows, techLabels22]
  )

  const updateColumns = (newColumns: CompareColumn[]) => {
    const params = columnsToSearchParams(searchParams, newColumns)
    // Native history-API: Next oppdaterer useSearchParams uten ny server-rendering
    window.history.replaceState(null, '', `${pathname}?${params.toString()}`)

    // Synk til sammenligningsmenyen og knappene på produktsiden. Varianter som ikke finnes lenger, tas ikke med.
    const selections = groupSelectionsByProduct(newColumns.filter((column) => !column.missingVariantId))
    productsInMenu
      .filter((product) => selections[product.id])
      .forEach((product) => setVariantSelections(product.id, selections[product.id]))
  }

  const addSelection = (product: Product, selection: string) => {
    if (columns.some((c) => c.product.id === product.id && selectionOf(c) === selection)) return
    const variant = selection === ALL_VARIANTS ? null : (product.variants.find((v) => v.id === selection) ?? null)
    if (selection !== ALL_VARIANTS && !variant) return

    // Ny kolonne plasseres etter de andre kolonnene for samme produkt
    const newColumn: CompareColumn = { key: `${product.id}:${selection}`, product, variant }
    const insertAt = columns.findLastIndex((c) => c.product.id === product.id) + 1
    updateColumns([...columns.slice(0, insertAt), newColumn, ...columns.slice(insertAt)])
  }

  const removeColumn = (column: CompareColumn) => {
    const remaining = columns.filter((c) => c.key !== column.key)
    if (!remaining.some((c) => c.product.id === column.product.id)) {
      // Siste kolonne for produktet: fjern hele produktet fra sammenligningen
      removeProduct(column.product.id)
    }
    updateColumns(remaining)
  }

  const removeProductColumns = (product: Product) => {
    removeProduct(product.id)
    updateColumns(columns.filter((c) => c.product.id !== product.id))
  }

  const productGroups = groupColumnsByProduct(columns)
  const productBoundaries = productBoundaryIndices(columns)

  if (columns.length === 0) {
    return (
      <VStack gap={'space-16'}>
        <BodyShort>Ingen hjelpemidler til sammenlikning.</BodyShort>
        <Link href={'/'}>Tilbake til forsiden</Link>
      </VStack>
    )
  }

  return (
    <VStack
      className={styles.compareTable}
      width={'100%'}
      style={{ '--compare-column-count': columns.length } as React.CSSProperties}
    >
      <Table className={styles.stickyTop}>
        <CompareColGroup columnCount={columns.length} />
        <TableBody>
          <TableRow>
            <TableColumnHeader></TableColumnHeader>
            {productGroups.map(({ product, columns: productColumns }, groupIndex) => (
              <TableDataCell
                key={product.id}
                colSpan={productColumns.length}
                className={classNames(styles.columnHeaderCell, { [styles.productBoundary]: groupIndex > 0 })}
              >
                <CompareProductHeader
                  product={product}
                  columns={productColumns}
                  onAddSelection={(selection) => addSelection(product, selection)}
                  onRemove={() => removeProductColumns(product)}
                />
              </TableDataCell>
            ))}
          </TableRow>
          {columns.some((column) => column.variant || column.missingVariantId) && (
            <TableRow>
              <TableColumnHeader scope="row" className={styles.variantHeaderCell}>
                Variant
              </TableColumnHeader>
              {columns.map((column, index) => (
                <TableColumnHeader
                  key={column.key}
                  scope="col"
                  className={classNames(styles.variantHeaderCell, {
                    [styles.productBoundary]: productBoundaries.includes(index),
                  })}
                >
                  <CompareVariantLabel column={column} onRemove={() => removeColumn(column)} />
                </TableColumnHeader>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CompareMetaDataTable columns={columns} productBoundaries={productBoundaries} />
      <CompareTechDataSections
        groupedTechDataRows={groupedTechDataRows}
        groupedTechDataRows22={groupedTechDataRows22}
        productCount={columns.length}
        productBoundaries={productBoundaries}
      />
    </VStack>
  )
}
