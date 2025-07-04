'use client'

import { Product, ProductVariant } from '@/utils/product-util'
import { useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { customSort, sortColumnsByRowKey } from '@/app/produkt/[id]/variantTable/variant-utils'
import { toValueAndUnit } from '@/utils/string-util'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { Alert, Box, CopyButton, Heading, Table, VStack } from '@navikt/ds-react'
import { FilterRow } from '@/app/produkt/[id]/variantTable/FilterRow'
import productTop from '@/app/produkt/[id]/ProductTop.module.scss'
import styles from './VariantTable.module.scss'
import { logActionEvent } from '@/utils/amplitude'
import { VariantStatusRowNew } from '@/app/produkt/[id]/variantTable/VariantStatusRowNew'
import { VariantRankRow } from '@/app/produkt/[id]/variantTable/VariantRankRow'
import { VariantPostRow } from '@/app/produkt/[id]/variantTable/VariantPostRow'

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
  const sortColumns: SortColumns = { orderBy: 'Expired', direction: 'ascending' }
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

  const dropdownFilterPredicate = (variant: ProductVariant, filterFieldName: string) => {
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

  const onAgreementFilterPredicate = (variant: ProductVariant, filterFieldName: string) => {
    return searchParams.get(filterFieldName) ? variant.hasAgreement : true
  }

  const variantIdSearchPredicate = (variant: ProductVariant, filterFieldName: string) => {
    const searchTerm = searchParams.get(filterFieldName)?.toLocaleLowerCase()

    if (searchTerm && (searchTermMatchesHms || searchTermMatchesSupplierRef)) {
      return (
        variant.hmsArtNr?.toLocaleLowerCase() === searchTerm || variant.supplierRef?.toLocaleLowerCase() === searchTerm
      )
    }
    return true
  }

  const termFilterLabel = searchParams.get('term')
    ? `${searchTermMatchesHms ? 'HMS-nummer' : searchTermMatchesSupplierRef ? 'Lev-artnr' : 'search'}: ${searchParams.get('term')}`
    : 'search'

  const filters: Filter[] = [
    { fieldName: 'Setebredde', label: 'Setebredde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Setedybde', label: 'Setedybde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Setehøyde', label: 'Setehøyde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Bredde', label: 'Bredde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Terskelhøyde', label: 'Terskelhøyde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Lengde', label: 'Lengde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Håndtak hreg', label: 'Håndtak hreg', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Livvidde', label: 'Livvidde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    {
      fieldName: 'Materiale i trekk',
      label: 'Materiale i trekk',
      type: FilterType.DROPDOWN,
      predicate: dropdownFilterPredicate,
    },
    { fieldName: 'Trekk', label: 'Trekk', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Størrelse', label: 'Størrelse', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    {
      fieldName: 'agreement',
      label: 'På avtale med Nav',
      type: FilterType.TOGGLE,
      predicate: onAgreementFilterPredicate,
    },
    {
      fieldName: 'term',
      label: termFilterLabel,
      type: FilterType.TOGGLE,
      predicate: variantIdSearchPredicate,
    },
  ]

  const productVariantsToShow = product.variants.filter((variant) => {
    return filters.every((filter) => filter.predicate(variant, filter.fieldName))
  })

  const columnsSortedByKey = sortColumnsByRowKey(productVariantsToShow, sortColumns)
  const allDataKeys =
    product.isoCategory === '18301505'
      ? [...new Set(columnsSortedByKey.flatMap((variant) => Object.keys(variant.techData)))].sort(customSort)
      : [...new Set(columnsSortedByKey.flatMap((variant) => Object.keys(variant.techData)))].sort()

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
        <div className={styles.variantsTable} id="variants-table">
          <Table zebraStripes>
            <Table.Header>
              <VariantStatusRowNew variants={columnsSortedByKey} />
              <Table.Row>
                <Table.ColumnHeader ref={variantNameElementRef}>Navn på variant</Table.ColumnHeader>
                {columnsSortedByKey.map((variant) => (
                  <Table.ColumnHeader key={'artname-' + variant.id}>{variant.articleName}</Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {hasHmsNumber && (
                <Table.Row>
                  <Table.HeaderCell>HMS-nummer</Table.HeaderCell>
                  {columnsSortedByKey.map((variant, i) => (
                    <Table.DataCell
                      key={'hms-' + variant.id}
                      className={selectedColumn === i ? styles.selectedColumn : ''}
                      onClick={() => handleColumnClick(i)}
                    >
                      <CopyButton
                        size="small"
                        className={productTop.copyButton}
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
                {columnsSortedByKey.map((variant, i) => (
                  <Table.DataCell
                    key={'levart-' + variant.id}
                    className={selectedColumn === i ? styles.selectedColumn : ''}
                    onClick={() => handleColumnClick(i)}
                  >
                    <CopyButton
                      size="small"
                      className={productTop.copyButton}
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
                  variants={columnsSortedByKey}
                  selectedColumn={selectedColumn}
                  handleColumnClick={handleColumnClick}
                />
              )}
              {postSet.size > 1 && (
                <VariantPostRow
                  variants={columnsSortedByKey}
                  selectedColumn={selectedColumn}
                  handleColumnClick={handleColumnClick}
                />
              )}
              {bestillingsordningVaries && (
                <Table.Row>
                  <Table.HeaderCell>Bestillingsordning</Table.HeaderCell>
                  {columnsSortedByKey.map((variant, i) => (
                    <Table.DataCell
                      key={'bestillingsordning-' + variant.id}
                      className={selectedColumn === i ? styles.selectedColumn : ''}
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
                  {columnsSortedByKey.map((variant, i) => (
                    <Table.DataCell
                      key={'behovsmelding-' + variant.id}
                      className={selectedColumn === i ? styles.selectedColumn : ''}
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
                          className={selectedColumn === i ? styles.selectedColumn : ''}
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
      )}
    </Box>
  )
}
