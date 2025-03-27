'use client'

import { Product, ProductVariant } from '@/utils/product-util'
import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { mapSearchParams } from '@/utils/mapSearchParams'
import useSWR from 'swr'
import { fetchProducts } from '@/utils/api-util'
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

export type VariantFilter = {
  name: string
  filterFunction: (variant: ProductVariant) => boolean
}

export type TechDataRow = { key: string; values: string[]; isCommonField: boolean }

export const VariantTable = ({ product }: { product: Product }) => {
  const [sortColumns, setSortColumns] = useState<SortColumns>({ orderBy: 'Expired', direction: 'ascending' })
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const variantNameElementRef = useRef<HTMLTableCellElement>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  const handleColumnClick = (columnKey: string) => {
    setSelectedColumn(columnKey)
  }

  const searchTermMatchesHms = product.variants
    .flatMap((variant) => [variant.hmsArtNr?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())
  const searchTermMatchesSupplierRef = product.variants
    .flatMap((variant) => [variant.supplierRef?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())

  const { data: dataAndFilter } = useSWR(
    { from: 0, size: 150, searchData: { ...searchData, searchTerm: '' }, dontCollapse: true, seriesId: product.id },
    fetchProducts,
    { keepPreviousData: true }
  )

  const productWithFilteredVariants = dataAndFilter && dataAndFilter.products

  const productVariantsToShowPre = useMemo(
    () =>
      product.variants.length > 1
        ? productWithFilteredVariants
          ? productWithFilteredVariants.length > 0
            ? searchTermMatchesHms
              ? productWithFilteredVariants[0].variants.filter((variant) => variant.hmsArtNr === searchData.searchTerm)
              : searchTermMatchesSupplierRef
                ? productWithFilteredVariants[0].variants.filter(
                    (variant) => variant.supplierRef === searchData.searchTerm
                  )
                : productWithFilteredVariants[0].variants
            : []
          : product.variants
        : product.variants,

    [product.variants, productWithFilteredVariants]
  )

  const seteBreddeFilter = (variant: ProductVariant) => {
    if (searchParams.get('Setebredde')) {
      let value: number
      if (variant.techData['Setebredde']) {
        value = parseInt(variant.techData['Setebredde'].value)
      } else {
        value = parseInt(variant.techData['Setebredde min'].value)
      }

      const searchTarget = parseInt(searchParams.get('Setebredde')!.split(' ')[0])

      return searchTarget === value
    }
    return true
  }

  const seteDybdeFilter = (variant: ProductVariant) => {
    if (searchParams.get('Setedybde')) {
      const min = parseInt(variant.techData['Setedybde min'].value)
      const max = parseInt(variant.techData['Setedybde maks'].value)

      const searchTarget = parseInt(searchParams.get('Setedybde')!.split(' ')[0])

      return min <= searchTarget && searchTarget <= max
    }
    return true
  }

  const seteHøydeFilter = (variant: ProductVariant) => {
    if (searchParams.get('Setehøyde')) {
      const min = parseInt(variant.techData['Setehøyde min'].value)
      const max = parseInt(variant.techData['Setehøyde maks'].value)

      const searchTarget = parseInt(searchParams.get('Setehøyde')!.split(' ')[0])

      return min <= searchTarget && searchTarget <= max
    }
    return true
  }

  const variantFilters: VariantFilter[] = [
    { name: 'Setebredde', filterFunction: seteBreddeFilter },
    { name: 'Setedybde', filterFunction: seteDybdeFilter },
    { name: 'Setehøyde', filterFunction: seteHøydeFilter },
  ]

  const productVariantsToShow = productVariantsToShowPre.filter((variant) => {
    return variantFilters.every((variantFilter) => variantFilter.filterFunction(variant))
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
          <FilterRow variants={product.variants} variantFilters={variantFilters} techDataRows={techDataRows} />
          <Heading level="3" size="small">
            {`${productVariantsToShow.length} av ${product.variantCount} varianter`}
          </Heading>
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
                    {sortedByKey.map((variant) => (
                      <Table.DataCell key={'hms-' + variant.id}>
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
                  {sortedByKey.map((variant) => (
                    <Table.DataCell key={'levart-' + variant.id}>
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
                        className={selectedColumn === variant.id ? variantTable.selectedColumn : ''}
                        onClick={() => handleColumnClick(variant.id)}
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
                        className={selectedColumn === variant.id ? variantTable.selectedColumn : ''}
                        onClick={() => handleColumnClick('column-' + i)}
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
                          <Table.DataCell key={key + '-' + i}>{value}</Table.DataCell>
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
