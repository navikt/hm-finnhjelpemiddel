'use client'

import type { TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTable'
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
  parseColumns,
  selectionOf,
} from '@/app/sammenlign/compare-columns'

import React, { useMemo } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'

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
  const { removeProduct } = useHydratedCompareStore()

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
  }

  const toggleSelection = (product: Product, selection: string, isSelected: boolean) => {
    const productColumns = columns.filter((c) => c.product.id === product.id)

    if (isSelected) {
      if (productColumns.some((c) => selectionOf(c) === selection)) return
      const variant = selection === ALL_VARIANTS ? null : (product.variants.find((v) => v.id === selection) ?? null)
      if (selection !== ALL_VARIANTS && !variant) return

      // Ny kolonne plasseres etter de andre kolonnene for samme produkt.
      // Varianter som ikke finnes lenger, ryddes bort når brukeren gjør et nytt valg.
      const newColumn: CompareColumn = { key: `${product.id}:${selection}`, product, variant }
      const insertAt = columns.findLastIndex((c) => c.product.id === product.id) + 1
      const withNew = [...columns.slice(0, insertAt), newColumn, ...columns.slice(insertAt)]
      updateColumns(withNew.filter((c) => !(c.product.id === product.id && c.missingVariantId)))
      return
    }

    // Produktet skal alltid ha minst én kolonne. Hele produktet fjernes med krysset på produktkortet.
    if (productColumns.length <= 1) return
    updateColumns(columns.filter((c) => !(c.product.id === product.id && selectionOf(c) === selection)))
  }

  const removeProductColumns = (product: Product) => {
    removeProduct(product.id)
    updateColumns(columns.filter((c) => c.product.id !== product.id))
  }

  // Kolonnene er gruppert per produkt (se parseColumns), så hvert produkt får én sammenslått celle
  const productGroups = columns.reduce<{ product: Product; columns: CompareColumn[] }[]>((groups, column) => {
    const last = groups.at(-1)
    if (last?.product.id === column.product.id) {
      last.columns.push(column)
    } else {
      groups.push({ product: column.product, columns: [column] })
    }
    return groups
  }, [])

  if (columns.length === 0) {
    return (
      <VStack gap={'space-16'}>
        <BodyShort>Ingen hjelpemidler til sammenlikning.</BodyShort>
        <Link href={'/'}>Tilbake til forsiden</Link>
      </VStack>
    )
  }

  return (
    <VStack className={styles.compareTable} width={'100%'}>
      <Table className={styles.stickyTop}>
        <TableBody>
          <TableRow>
            <TableColumnHeader></TableColumnHeader>
            {productGroups.map(({ product, columns: productColumns }) => (
              <TableDataCell key={product.id} colSpan={productColumns.length} className={styles.columnHeaderCell}>
                <CompareProductHeader
                  product={product}
                  columns={productColumns}
                  onToggleSelection={(selection, isSelected) => toggleSelection(product, selection, isSelected)}
                  onRemove={() => removeProductColumns(product)}
                />
              </TableDataCell>
            ))}
          </TableRow>
          {columns.some((column) => column.variant || column.missingVariantId) && (
            <TableRow>
              <TableColumnHeader></TableColumnHeader>
              {columns.map((column) => (
                <TableColumnHeader key={column.key} scope="col" className={styles.variantHeaderCell}>
                  <CompareVariantLabel column={column} />
                </TableColumnHeader>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CompareMetaDataTable columns={columns} />
      <CompareTechDataSections
        groupedTechDataRows={groupedTechDataRows}
        groupedTechDataRows22={groupedTechDataRows22}
        productCount={columns.length}
      />
    </VStack>
  )
}
