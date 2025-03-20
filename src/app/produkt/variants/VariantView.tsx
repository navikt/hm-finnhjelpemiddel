'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon, TabsIcon } from '@navikt/aksel-icons'
import { Alert, Box, Heading, Table } from '@navikt/ds-react'
import { fetchProducts } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { useSearchParams } from 'next/navigation'
import { customSort, hasDifferentValues, sortColumnsByRowKey } from '@/app/produkt/variants/variant-utils'
import { VariantStatusRow } from '@/app/produkt/variants/VariantStatusRow'
import { VariantNameRow } from '@/app/produkt/variants/VariantNameRow'
import VariantHmsNumberRow from '@/app/produkt/variants/VariantHmsNumberRow'
import { VariantSupplierRefRow } from '@/app/produkt/variants/VariantSupplierRefRow'
import { VariantRankRow } from '@/app/produkt/variants/VariantRankRowProps'
import { VariantPostRow } from '@/app/produkt/variants/VariantPostRow'
import { VariantTechnicalDataRow } from '@/app/produkt/variants/VariantTechnicalDataRow'
import { Product } from '@/utils/product-util'
import { toValueAndUnit } from '@/utils/string-util'
import NextLink, { default as Link } from 'next/link'
import useSWR from 'swr'
import { VariantFilters } from '@/app/produkt/variants/VariantFilters'
import { SharedVariantDataTable } from '@/app/produkt/variants/SharedVariantDataTable'
import { SingleVariantTable } from '@/app/produkt/variants/SingleVariantTable'

export type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

export const VariantView = ({ product }: { product: Product }) => {
  const [sortColumns, setSortColumns] = useState<SortColumns>({ orderBy: 'Expired', direction: 'ascending' })
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const variantNameElementRef = useRef<HTMLTableCellElement>(null)
  const [variantNameElementHeight, setVariantNameElementHeight] = useState(0)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  const handleColumnClick = (columnKey: string) => {
    setSelectedColumn(columnKey)
  }

  useEffect(() => {
    const handleResize = () => {
      if (variantNameElementRef.current) {
        setVariantNameElementHeight(variantNameElementRef.current.offsetHeight)
      }
    }
    window.addEventListener('resize', handleResize, false)
  }, [])

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

  const productVariantsToShow = useMemo(
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

  useEffect(() => {
    if (variantNameElementRef.current) {
      setVariantNameElementHeight(variantNameElementRef.current.offsetHeight)
    }
  }, [productVariantsToShow])

  const sortedByKey = sortColumnsByRowKey(productVariantsToShow, sortColumns)
  const allDataKeys =
    product.isoCategory === '18301505'
      ? [...new Set(sortedByKey.flatMap((variant) => Object.keys(variant.techData)))].sort(customSort)
      : [...new Set(sortedByKey.flatMap((variant) => Object.keys(variant.techData)))].sort()

  const rows: { [key: string]: string[] } = Object.assign(
    {},
    ...allDataKeys.map((key) => ({
      [key]: productVariantsToShow.map((variant) =>
        variant.techData[key] !== undefined
          ? toValueAndUnit(variant.techData[key].value, variant.techData[key].unit)
          : '-'
      ),
    }))
  )

  const commonDataRows: { [key: string]: string } = Object.assign(
    {},
    ...allDataKeys
      .filter((key) =>
        product.variants.every(
          (variant) => variant.techData[key] && variant.techData[key].value === product.variants[0].techData[key].value
        )
      )
      .map((key) => ({
        [key]: toValueAndUnit(product.variants[0].techData[key].value, product.variants[0].techData[key].unit),
      }))
  )

  const hasAgreementSet = new Set(product.variants.map((p) => p.hasAgreement))
  const hasAgreementVaries = hasAgreementSet.size > 1
  const rankSet = new Set(product.agreements.map((agr) => agr.rank))
  const postSet = new Set(product.agreements.map((agr) => agr.postNr))
  const sortRank = rankSet.size !== 1 || hasAgreementVaries

  const handleSortRow = (sortKey: string) => {
    setSortColumns({
      orderBy: sortKey,
      direction:
        sortKey === sortColumns.orderBy
          ? sortColumns.direction === 'ascending'
            ? 'descending'
            : 'ascending'
          : 'ascending',
    })
  }

  const iconBasedOnState = (key: string) => {
    return sortColumns.orderBy === key ? (
      sortColumns.direction === 'ascending' ? (
        <ArrowUpIcon title="Sort ascending" height={30} width={30} aria-hidden={true} />
      ) : (
        <ArrowDownIcon title="Sort descending" height={30} width={30} aria-hidden={true} />
      )
    ) : (
      <ArrowsUpDownIcon title="Sort direction not set" height={30} width={30} aria-hidden={true} />
    )
  }

  const bestillingsordningVaries = new Set(product.variants.map((p) => p.bestillingsordning)).size === 2
  const digitalSoknadVaries = new Set(product.variants.map((p) => p.digitalSoknad)).size === 2
  const hasHmsNumber = product.variants.some((p) => p.hmsArtNr)

  return (
    <>
      {product.variants.length === 1 ? (
        <SingleVariantTable variant={product.variants[0]} rows={rows} variantNameElementRef={variantNameElementRef} />
      ) : (
        <>
          <SharedVariantDataTable commonDataRows={commonDataRows} />
          <div className="spacing-top--small spacing-bottom--small">
            <NextLink
              href={`/produkt/${product.id}/variants`}
              className="variant-table_fullscreen-link"
              target={'_blank'}
            >
              {`Åpne fullskjerm-varianttabell i ny fane`}
              <TabsIcon aria-hidden fontSize={'1.5rem'} style={{ marginLeft: '0.5rem' }} />
            </NextLink>
          </div>
          <Heading level="2" size="large" spacing>
            <Link href={'#variants-table'} className="product-page__header_anchorLink">
              Egenskaper som varierer mellom varianter i denne serien
            </Link>
          </Heading>
          <Box paddingBlock="4">
            <VariantFilters product={product} />
            <Heading level="3" size="small" className="spacing-vertical--small">
              {`${productVariantsToShow.length} av ${product.variantCount} varianter:`}
            </Heading>

            {productVariantsToShow.length === 0 && (
              <Alert variant="warning" className="spacing-top--small">
                Ingen av variantene passer med filteret ditt
              </Alert>
            )}

            {productVariantsToShow.length > 0 && (
              <>
                <div className="variants-table" id="variants-table">
                  <Table zebraStripes>
                    <Table.Header>
                      <VariantStatusRow variants={sortedByKey} />
                      <VariantNameRow
                        variants={sortedByKey}
                        sortColumns={sortColumns}
                        handleSortRow={handleSortRow}
                        variantNameElementRef={variantNameElementRef}
                        iconBasedOnState={iconBasedOnState}
                      />
                    </Table.Header>
                    <Table.Body>
                      {hasHmsNumber && (
                        <VariantHmsNumberRow
                          sortedByKey={sortedByKey}
                          sortColumns={sortColumns}
                          handleSortRow={handleSortRow}
                          variantNameElementHeight={variantNameElementHeight}
                          selectedColumn={selectedColumn}
                          handleColumnClick={handleColumnClick}
                          iconBasedOnState={iconBasedOnState}
                        />
                      )}
                      <VariantSupplierRefRow
                        sortedByKey={sortedByKey}
                        sortColumns={sortColumns}
                        handleSortRow={handleSortRow}
                        selectedColumn={selectedColumn}
                        handleColumnClick={handleColumnClick}
                        iconBasedOnState={iconBasedOnState}
                      />
                      {rankSet.size > 1 && (
                        <VariantRankRow
                          sortedByKey={sortedByKey}
                          sortColumns={sortColumns}
                          handleSortRow={handleSortRow}
                          sortRank={sortRank}
                          hasAgreementSet={hasAgreementSet}
                          selectedColumn={selectedColumn}
                          handleColumnClick={handleColumnClick}
                          iconBasedOnState={iconBasedOnState}
                        />
                      )}
                      {postSet.size > 1 && (
                        <VariantPostRow
                          sortedByKey={sortedByKey}
                          sortColumns={sortColumns}
                          handleSortRow={handleSortRow}
                          postSet={postSet}
                          sortRank={sortRank}
                          selectedColumn={selectedColumn}
                          handleColumnClick={handleColumnClick}
                          iconBasedOnState={iconBasedOnState}
                        />
                      )}
                      {bestillingsordningVaries && (
                        <Table.Row>
                          <Table.HeaderCell>Bestillingsordning</Table.HeaderCell>
                          {sortedByKey.map((variant, i) => (
                            <Table.DataCell
                              key={'bestillingsordning-' + variant.id}
                              className={selectedColumn === variant.id ? 'selected-column' : ''}
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
                              className={selectedColumn === variant.id ? 'selected-column' : ''}
                              onClick={() => handleColumnClick('column-' + i)}
                            >
                              {variant.digitalSoknad ? 'Ja' : 'Nei'}
                            </Table.DataCell>
                          ))}
                        </Table.Row>
                      )}
                      {Object.keys(rows).length > 0 &&
                        Object.entries(rows).map(([key, row]) => {
                          const isSortableRow = hasDifferentValues({ row })
                          if (Object.keys(commonDataRows).some((commonKey) => commonKey === key)) return null
                          return (
                            <VariantTechnicalDataRow
                              key={key}
                              technicalDataName={key}
                              row={row}
                              variantIds={sortedByKey.map((variant) => variant.id)}
                              sortColumns={sortColumns}
                              handleSortRow={handleSortRow}
                              isSortableRow={isSortableRow}
                              iconBasedOnState={iconBasedOnState}
                              selectedColumn={selectedColumn}
                              handleColumnClick={handleColumnClick}
                            />
                          )
                        })}
                    </Table.Body>
                  </Table>
                </div>
              </>
            )}
          </Box>
        </>
      )}
    </>
  )
}
