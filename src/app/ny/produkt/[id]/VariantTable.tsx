'use client'

import { Product, ProductVariant } from '@/utils/product-util'
import { useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { customSort, sortColumnsByRowKey } from '@/app/produkt/variants/variant-utils'
import { toValueAndUnit } from '@/utils/string-util'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { Alert, Box, CopyButton, Heading, Table, VStack } from '@navikt/ds-react'
import { FilterRow } from '@/app/ny/produkt/[id]/FilterRow'
import styles from '@/app/ny/produkt/[id]/ProductTop.module.scss'
import variantTable from './VariantTable.module.scss'
import { logActionEvent } from '@/utils/amplitude'
import { VariantStatusRowNew } from '@/app/ny/produkt/[id]/VariantStatusRowNew'
import { VariantRankRow } from '@/app/ny/produkt/[id]/VariantRankRow'
import { VariantPostRow } from '@/app/ny/produkt/[id]/VariantPostRow'

export type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

export type TechDataRow = { key: string; values: string[]; isCommonField: boolean; unit: string | undefined }

export enum FilterType {
  DROPDOWN,
  TOGGLE,
}
export type Filter = {
  fieldName: string
  label: string
  type: FilterType
  predicate: (variant: ProductVariant, filterFieldName: string) => boolean
}

export const VariantTable = ({ product }: { product: Product }) => {
  const [sortColumns, setSortColumns] = useState<SortColumns>({ orderBy: 'Expired', direction: 'ascending' })
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const variantNameElementRef = useRef<HTMLTableCellElement>(null)
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null)

  const handleColumnClick = (columnKey: number) => {
    setSelectedColumn(columnKey)
  }

  const searchTermMatchesHms = product.variants
    .flatMap((variant) => [variant.hmsArtNr?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())
  const searchTermMatchesSupplierRef = product.variants
    .flatMap((variant) => [variant.supplierRef?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())

  const filterFunction = (variant: ProductVariant, filterFieldName: string) => {
    if (searchParams.get(filterFieldName)) {
      const isMinMax = variant.techData[`${filterFieldName} min`] && variant.techData[`${filterFieldName} maks`]

      if (isMinMax) {
        const min = parseInt(variant.techData[`${filterFieldName} min`].value)
        const max = parseInt(variant.techData[`${filterFieldName} maks`].value)

        const searchTarget = parseInt(searchParams.get(filterFieldName)!)

        return min <= searchTarget && searchTarget <= max
      }

      if (variant.techData[filterFieldName]) {
        const value = variant.techData[filterFieldName].value.trim()
        const searchTarget = searchParams.get(filterFieldName)!

        return searchTarget === value
      }
    }
    return true
  }

  const onAgreementFilter = (variant: ProductVariant, filterFieldName: string) => {
    return searchParams.get(filterFieldName) ? variant.hasAgreement : true
  }

  const variantIdSearch = (variant: ProductVariant, filterFieldName: string) => {
    const searchTerm = searchParams.get(filterFieldName)?.toLocaleLowerCase()

    if (searchTerm && (searchTermMatchesHms || searchTermMatchesSupplierRef)) {
      return (
        variant.hmsArtNr?.toLocaleLowerCase() === searchTerm || variant.supplierRef?.toLocaleLowerCase() === searchTerm
      )
    }
    return true
  }

  const filters: Filter[] = [
    { fieldName: 'Setebredde', label: 'Setebredde', type: FilterType.DROPDOWN, predicate: filterFunction },
    { fieldName: 'Setedybde', label: 'Setedybde', type: FilterType.DROPDOWN, predicate: filterFunction },
    { fieldName: 'Setehøyde', label: 'Setehøyde', type: FilterType.DROPDOWN, predicate: filterFunction },
    { fieldName: 'Bredde', label: 'Bredde', type: FilterType.DROPDOWN, predicate: filterFunction },
    { fieldName: 'Lengde', label: 'Lengde', type: FilterType.DROPDOWN, predicate: filterFunction },
    { fieldName: 'Håndtak hreg', label: 'Håndtak hreg', type: FilterType.DROPDOWN, predicate: filterFunction },
    { fieldName: 'Livvidde', label: 'Livvidde', type: FilterType.DROPDOWN, predicate: filterFunction },
    {
      fieldName: 'Materiale i trekk',
      label: 'Materiale i trekk',
      type: FilterType.DROPDOWN,
      predicate: filterFunction,
    },
    { fieldName: 'Trekk', label: 'Trekk', type: FilterType.DROPDOWN, predicate: filterFunction },
    { fieldName: 'Størrelse', label: 'Størrelse', type: FilterType.DROPDOWN, predicate: filterFunction },
    { fieldName: 'agreement', label: 'På avtale med Nav', type: FilterType.TOGGLE, predicate: onAgreementFilter },
    {
      fieldName: 'term',
      label: searchParams.get('term') ? `variant: ${searchParams.get('term')}` : 'search',
      type: FilterType.TOGGLE,
      predicate: variantIdSearch,
    },
  ]

  const productVariantsToShow = product.variants.filter((variant) => {
    return filters.every((filter) => filter.predicate(variant, filter.fieldName))
  })

  const sortedByKey = sortColumnsByRowKey(productVariantsToShow, sortColumns)
  const allDataKeys =
    product.isoCategory === '18301505'
      ? [...new Set(sortedByKey.flatMap((variant) => Object.keys(variant.techData)))].sort(customSort)
      : [...new Set(sortedByKey.flatMap((variant) => Object.keys(variant.techData)))].sort()

  const techDataRows: TechDataRow[] = allDataKeys.map((key) => {
    return {
      key: key,
      values: productVariantsToShow.map((variant) =>
        variant.techData[key] !== undefined
          ? toValueAndUnit(variant.techData[key].value, variant.techData[key].unit)
          : '-'
      ),
      isCommonField: product.variants.every(
        (variant) => variant.techData[key] && variant.techData[key].value === product.variants[0].techData[key].value
      ),
      unit: productVariantsToShow.find((variant) => variant.techData[key] !== undefined)?.techData[key].unit,
    }
  })

  const hasAgreementSet = new Set(product.variants.map((p) => p.hasAgreement))
  const rankSet = new Set(product.agreements.map((agr) => agr.rank))
  const postSet = new Set(product.agreements.map((agr) => agr.postNr))

  const bestillingsordningVaries = new Set(product.variants.map((p) => p.bestillingsordning)).size === 2
  const digitalSoknadVaries = new Set(product.variants.map((p) => p.digitalSoknad)).size === 2
  const hasHmsNumber = product.variants.some((p) => p.hmsArtNr)

  return (
    <Box>
      {product.variants.length > 1 && (
        <VStack gap={'4'}>
          <Heading size={'medium'} level={'2'} spacing>
            Andre egenskaper
          </Heading>

          <VStack gap={'4'}>
            <FilterRow
              variants={product.variants}
              filterConfigs={filters}
              techDataRows={techDataRows}
              numberOfVariantsToShow={productVariantsToShow.length}
            />
          </VStack>
        </VStack>
      )}

      {productVariantsToShow.length === 0 && (
        <Alert variant="warning" className="spacing-top--small">
          Ingen av variantene passer med filteret ditt
        </Alert>
      )}

      {productVariantsToShow.length > 0 && (
        <>
          <div className={variantTable.variantsTable} id="variants-table">
            <Table zebraStripes>
              <Table.Header>
                <VariantStatusRowNew variants={sortedByKey} />
                <Table.Row>
                  <Table.ColumnHeader ref={variantNameElementRef}>Navn på variant</Table.ColumnHeader>
                  {sortedByKey.map((variant) => (
                    <Table.ColumnHeader key={'artname-' + variant.id}>{variant.articleName}</Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {hasHmsNumber && (
                  <Table.Row>
                    <Table.HeaderCell>HMS-nummer</Table.HeaderCell>
                    {sortedByKey.map((variant, i) => (
                      <Table.DataCell
                        key={'hms-' + variant.id}
                        className={selectedColumn === i ? variantTable.selectedColumn : ''}
                        onClick={() => handleColumnClick(i)}
                      >
                        <CopyButton
                          size="small"
                          className={styles.copyButton}
                          copyText={variant.hmsArtNr ?? ''}
                          text={variant.hmsArtNr ?? ''}
                          activeText="kopiert"
                          variant="action"
                          activeIcon={<ThumbUpIcon aria-hidden />}
                          iconPosition="right"
                          onClick={() => logActionEvent('kopier')}
                        />
                      </Table.DataCell>
                    ))}
                  </Table.Row>
                )}
                <Table.Row>
                  <Table.HeaderCell>Lev-artnr</Table.HeaderCell>
                  {sortedByKey.map((variant, i) => (
                    <Table.DataCell
                      key={'levart-' + variant.id}
                      className={selectedColumn === i ? variantTable.selectedColumn : ''}
                      onClick={() => handleColumnClick(i)}
                    >
                      <CopyButton
                        size="small"
                        className={styles.copyButton}
                        copyText={variant.supplierRef}
                        text={variant.supplierRef}
                        activeText="kopiert"
                        variant="action"
                        activeIcon={<ThumbUpIcon aria-hidden />}
                        iconPosition="right"
                        onClick={() => logActionEvent('kopier')}
                      />
                    </Table.DataCell>
                  ))}
                </Table.Row>
                {rankSet.size > 1 && (
                  <VariantRankRow
                    sortedByKey={sortedByKey}
                    hasAgreementSet={hasAgreementSet}
                    selectedColumn={selectedColumn}
                    handleColumnClick={handleColumnClick}
                  />
                )}
                {postSet.size > 1 && (
                  <VariantPostRow
                    sortedByKey={sortedByKey}
                    selectedColumn={selectedColumn}
                    handleColumnClick={handleColumnClick}
                  />
                )}
                {bestillingsordningVaries && (
                  <Table.Row>
                    <Table.HeaderCell>Bestillingsordning</Table.HeaderCell>
                    {sortedByKey.map((variant, i) => (
                      <Table.DataCell
                        key={'bestillingsordning-' + variant.id}
                        className={selectedColumn === i ? variantTable.selectedColumn : ''}
                        onClick={() => handleColumnClick(i)}
                      >
                        {variant.bestillingsordning ? 'Ja' : 'Nei'}
                      </Table.DataCell>
                    ))}
                  </Table.Row>
                )}
                {digitalSoknadVaries && (
                  <Table.Row>
                    <Table.HeaderCell>Digital behovsmelding</Table.HeaderCell>
                    {sortedByKey.map((variant, i) => (
                      <Table.DataCell
                        key={'behovsmelding-' + variant.id}
                        className={selectedColumn === i ? variantTable.selectedColumn : ''}
                        onClick={() => handleColumnClick(i)}
                      >
                        {variant.digitalSoknad ? 'Ja' : 'Nei'}
                      </Table.DataCell>
                    ))}
                  </Table.Row>
                )}
                {techDataRows.length > 0 &&
                  techDataRows.map(({ key, values, isCommonField }) => {
                    if (isCommonField) return null
                    return (
                      <Table.Row key={key + 'row'}>
                        <Table.HeaderCell>{key}</Table.HeaderCell>
                        {values.map((value, i) => (
                          <Table.DataCell
                            key={key + '-' + i}
                            className={selectedColumn === i ? variantTable.selectedColumn : ''}
                            onClick={() => handleColumnClick(i)}
                          >
                            {value}
                          </Table.DataCell>
                        ))}
                      </Table.Row>
                    )
                  })}
              </Table.Body>
            </Table>
          </div>
        </>
      )}
    </Box>
  )
}
