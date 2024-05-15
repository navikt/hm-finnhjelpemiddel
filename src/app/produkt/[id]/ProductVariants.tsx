'use client'

import { Fragment, useMemo, useState } from 'react'

import classNames from 'classnames'

import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { Alert, BodyLong, Button, CopyButton, Heading, Table, Tag, VStack } from '@navikt/ds-react'

import { viewAgreementRanks } from '@/components/AgreementIcon'
import { FilterViewProductPage } from '@/components/filters/FilterView'
import { fetchProducts, FetchProductsWithFilters, FilterData, getProductFilters } from '@/utils/api-util'
import { FilterFormState, initialFiltersFormState } from '@/utils/filter-util'
import { mapSearchParams, toSearchQueryString } from '@/utils/mapSearchParams'
import { Product, ProductVariant } from '@/utils/product-util'
import { sortAlphabetically, sortIntWithStringFallback } from '@/utils/sort-util'
import { formatAgreementRanks, toValueAndUnit } from '@/utils/string-util'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR from 'swr'

type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

export type FilterFormStateProductPage = {
  filters: FilterFormState
}

const ProductVariants = ({ product }: { product: Product }) => {
  /*  const [sortColumns, setSortColumns] = useState<SortColumns>({ orderBy: 'HMS', direction: 'ascending' })*/
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const anyExpired = product.variants.some((product) => product.status === 'INACTIVE')
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const formMethods = useForm<FilterFormStateProductPage>({
    mode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      filters: { ...initialFiltersFormState, ...searchData.filters },
    },
  })

  const onSubmit = () => {
    router.replace(
      `${pathname}?${toSearchQueryString({ filters: formMethods.getValues().filters }, searchData.searchTerm)}`,
      {
        scroll: false,
      }
    )
  }

  const {
    data: dataAndFilter,
    isLoading: postsIsLoading,
    error: postError,
  } = useSWR<FetchProductsWithFilters>(
    {
      from: 0,
      size: 150,
      searchData: searchData,
      dontCollapse: true,
      seriesId: product.id,
    },
    fetchProducts,
    { keepPreviousData: false }
  )

  const { data: filtersFromData, isLoading: filterIsLoading } = useSWR<FilterData>(
    { seriesId: product.id },
    getProductFilters,
    {
      keepPreviousData: true,
    }
  )

  const productWithFilteredVariants = dataAndFilter && dataAndFilter.products
  const filters = filtersFromData && filtersFromData

  const [sortColumns, setSortColumns] = useState<SortColumns>({
    orderBy: 'Expired',
    direction: 'ascending',
  })

  const sortColumnsByRowKey = (variants: ProductVariant[]) => {
    return variants.sort((variantA, variantB) => {
      if (sortColumns.orderBy === 'HMS') {
        if (variantA.hmsArtNr && variantB.hmsArtNr) {
          return sortIntWithStringFallback(
            variantA.hmsArtNr,
            variantB.hmsArtNr,
            sortColumns?.direction === 'descending'
          )
        }
        return -1
      }
      if (sortColumns.orderBy === 'levart') {
        if (variantA.supplierRef && variantB.supplierRef) {
          return sortIntWithStringFallback(
            variantA.supplierRef,
            variantB.supplierRef,
            sortColumns?.direction === 'descending'
          )
        }
        return -1
      }
      if (sortColumns.orderBy === 'Expired') {
        if (variantA.status && variantB.status) {
          if (variantA.agreements.length > 0 && variantB.agreements.length === 0) {
            return -1
          }
          if (variantB.agreements.length > 0 && variantA.agreements.length === 0) {
            return 1
          }

          return sortAlphabetically(variantA.status, variantB.status, sortColumns?.direction === 'descending')
        }
        return -1
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

  const productVariants = productWithFilteredVariants
    ? productWithFilteredVariants.length > 0
      ? productWithFilteredVariants[0].variants
      : []
    : product.variants

  let sortedByKey = sortColumnsByRowKey(productVariants)
  const allDataKeys = [...new Set(sortedByKey.flatMap((variant) => Object.keys(variant.techData)))]

  const rows: { [key: string]: string[] } = Object.assign(
    {},
    ...allDataKeys.map((key) => ({
      [key]: productVariants.map((variant) =>
        variant.techData[key] !== undefined
          ? toValueAndUnit(variant.techData[key].value, variant.techData[key].unit)
          : '-'
      ),
    }))
  )

  const hasDifferentValues = ({ row }: { row: string[] }) => {
    let uniqueValues = new Set(row)
    uniqueValues.delete('-')
    return uniqueValues.size > 1
  }

  const hasAgreementSet = new Set(product.variants.map((p) => p.hasAgreement))
  const hasAgreementVaries = hasAgreementSet.size > 1
  const rankSet = new Set(product.agreements.map((agr) => agr.rank))
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
        <ArrowUpIcon title="Sort ascending" height={30} width={30} />
      ) : (
        <ArrowDownIcon title="Sort descending" height={30} width={30} />
      )
    ) : (
      <ArrowsUpDownIcon title="Sort direction not set" height={30} width={30} />
    )
  }

  const numberOfvariantsOnAgreement = product.variants.filter((variant) => variant.hasAgreement === true).length
  const numberOfvariantsWithoutAgreement = product.variantCount - numberOfvariantsOnAgreement

  const textAllVariantsOnAgreement = `${product.title} finnes i ${numberOfvariantsOnAgreement} ${
    numberOfvariantsOnAgreement === 1 ? 'variant' : 'varianter'
  } på avtale med NAV.`
  const textVariantsWithAndWithoutAgreement =
    numberOfvariantsOnAgreement === 0
      ? `${product.title} finnes i ${numberOfvariantsWithoutAgreement} ${
          numberOfvariantsWithoutAgreement === 1 ? 'variant' : 'varianter'
        }.`
      : `${
          product.title
        } finnes i ${numberOfvariantsOnAgreement} varianter på avtale med NAV, og ${numberOfvariantsWithoutAgreement} ${
          numberOfvariantsWithoutAgreement === 1 ? 'variant' : 'varianter'
        } som ikke er på avtale med NAV.`

  const onSubmit = () => {
    router.replace(
      `${pathname}?${toSearchQueryString({ filters: formMethods.getValues().filters }, searchData.searchTerm)}`,
      {
        scroll: false,
      }
    )
  }
  const textMultipleVariants =
    'Nedenfor finner man en oversikt over egenskapene til de forskjellige variantene. Radene der egenskapene har ulike verdier kan sorteres.'
  const textOnlyOne = 'Nedenfor finner man en oversikt over egenskaper.'

  // const showHMSSuggestion = product.isoCategory.startsWith('1222')
  // {showHMSSuggestion && <HmsSuggestion product={product} />}

  return (
    <>
      <Heading level="2" size="large" spacing>
        Egenskaper
      </Heading>
      <BodyLong className={classNames({ 'spacing-bottom--medium': !anyExpired })}>
        {numberOfvariantsWithoutAgreement > 0 ? textVariantsWithAndWithoutAgreement : textAllVariantsOnAgreement}{' '}
        {product.variantCount === 1 ? textOnlyOne : textMultipleVariants}
      </BodyLong>
      <Heading level="3" size="medium" spacing>
        Varianter
      </Heading>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} aria-controls="variants-table">
          <FilterViewProductPage filters={filters} />

          <input type="submit" style={{ display: 'none' }} />
        </form>
      </FormProvider>

      {productVariants.length === 0 && <Alert variant="warning">Ingen av variantene matcher filteret ditt</Alert>}

      {productVariants.length > 0 && (
        <div className="variants-table" id="variants-table">
          <Table zebraStripes>
            <Table.Header>
              <Table.Row
                className={classNames('variants-table__sortable-row', {
                  'variants-table__sorted-row': sortColumns.orderBy === 'artName',
                })}
              >
                {product.variantCount > 1 ? (
                  <Table.ColumnHeader className="sortable">
                    <Button
                      className="sort-button"
                      size="xsmall"
                      style={{ textAlign: 'left' }}
                      variant="tertiary"
                      onClick={() => handleSortRow('artName')}
                      iconPosition="right"
                      icon={iconBasedOnState('artName')}
                    >
                      Navn på variant
                    </Button>
                  </Table.ColumnHeader>
                ) : (
                  <Table.HeaderCell>Navn på variant</Table.HeaderCell>
                )}
                {sortedByKey.map((variant) => (
                  <Table.ColumnHeader key={variant.id}>
                    <VStack gap="3">
                      {variant.status === 'INACTIVE' && (
                        <Tag size="small" variant="warning-moderate">
                          Utgått
                        </Tag>
                      )}
                      {variant.articleName}
                    </VStack>
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row
                className={classNames(
                  { 'variants-table__sortable-row': product.variantCount > 1 },
                  {
                    'variants-table__sorted-row': sortColumns.orderBy === 'HMS',
                  }
                )}
              >
                {product.variantCount > 1 ? (
                  <Table.HeaderCell className="sortable">
                    <Button
                      className="sort-button"
                      size="xsmall"
                      style={{ textAlign: 'left' }}
                      variant="tertiary"
                      onClick={() => handleSortRow('HMS')}
                      iconPosition="right"
                      icon={iconBasedOnState('HMS')}
                    >
                      HMS-nummer
                    </Button>
                  </Table.HeaderCell>
                ) : (
                  <Table.HeaderCell>HMS-nummer</Table.HeaderCell>
                )}
                {sortedByKey.map((variant) => (
                  <Table.DataCell key={variant.id}>
                    {variant.hmsArtNr ? (
                      <CopyButton
                        size="small"
                        className="hms-copy-button"
                        copyText={variant.hmsArtNr}
                        text={variant.hmsArtNr}
                        activeText="Kopiert"
                        variant="action"
                        activeIcon={<ThumbUpIcon aria-hidden />}
                        iconPosition="right"
                      />
                    ) : (
                      '-'
                    )}
                  </Table.DataCell>
                ))}
              </Table.Row>
              <Table.Row
                className={classNames(
                  { 'variants-table__sortable-row': product.variantCount > 1 },
                  {
                    'variants-table__sorted-row': sortColumns.orderBy === 'levart',
                  }
                )}
              >
                {product.variantCount > 1 ? (
                  <Table.HeaderCell className="sortable">
                    <Button
                      className="sort-button"
                      size="xsmall"
                      style={{ textAlign: 'left' }}
                      variant="tertiary"
                      onClick={() => handleSortRow('levart')}
                      iconPosition="right"
                      icon={iconBasedOnState('levart')}
                    >
                      Lev-artnr
                    </Button>
                  </Table.HeaderCell>
                ) : (
                  <Table.HeaderCell>Lev-artnr</Table.HeaderCell>
                )}
                {sortedByKey.map((variant) => (
                  <Table.DataCell key={variant.id}>
                    {variant.supplierRef ? (
                      <CopyButton
                        size="small"
                        className="hms-copy-button"
                        copyText={variant.supplierRef}
                        text={variant.supplierRef}
                        activeText="Kopiert"
                        variant="action"
                        activeIcon={<ThumbUpIcon aria-hidden />}
                        iconPosition="right"
                      />
                    ) : (
                      '-'
                    )}
                  </Table.DataCell>
                ))}
              </Table.Row>

              {product.agreements && product.agreements.length > 0 && (
                <Table.Row
                  className={classNames(
                    { 'variants-table__sortable-row': sortRank },
                    { 'variants-table__sorted-row': sortColumns.orderBy === 'rank' },
                    { 'variants-table__rank-row-on-agreement': hasAgreementSet.has(true) }
                  )}
                >
                  {sortRank ? (
                    <Table.HeaderCell className="sortable">
                      <Button
                        className="sort-button"
                        size="xsmall"
                        style={{ textAlign: 'left' }}
                        variant="tertiary"
                        onClick={() => handleSortRow('rank')}
                        iconPosition="right"
                        icon={iconBasedOnState('rank')}
                      >
                        Rangering
                      </Button>
                    </Table.HeaderCell>
                  ) : (
                    <Table.HeaderCell>Rangering</Table.HeaderCell>
                  )}
                  {sortedByKey.map((variant) => (
                    <Fragment key={variant.id}>
                      <Table.DataCell key={variant.id}>{viewAgreementRanks(variant.agreements)}</Table.DataCell>
                    </Fragment>
                  ))}
                </Table.Row>
              )}

              <Table.Row>
                <Table.HeaderCell>Bestillingsordning</Table.HeaderCell>
                {sortedByKey.map((variant) => (
                  <Table.DataCell key={variant.id}>{variant.bestillingsordning ? 'Ja' : 'Nei'}</Table.DataCell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Digital behovsmelding</Table.HeaderCell>
                {sortedByKey.map((variant) => (
                  <Table.DataCell key={variant.id}>{variant.digitalSoknad ? 'Ja' : 'Nei'}</Table.DataCell>
                ))}
              </Table.Row>
              {Object.keys(rows).length > 0 &&
                Object.entries(rows).map(([key, row], i) => {
                  const isSortableRow = hasDifferentValues({ row })
                  return (
                    <Table.Row
                      key={key + 'row' + i}
                      className={classNames(
                        { 'variants-table__sorted-row': key === sortColumns.orderBy },
                        { 'variants-table__sortable-row': isSortableRow }
                      )}
                    >
                      {isSortableRow ? (
                        <Table.HeaderCell className="sortable">
                          <Button
                            className="sort-button"
                            size="xsmall"
                            style={{ textAlign: 'left' }}
                            variant="tertiary"
                            onClick={() => handleSortRow(key)}
                            iconPosition="right"
                            icon={iconBasedOnState(key)}
                          >
                            {key}
                          </Button>
                        </Table.HeaderCell>
                      ) : (
                        <Table.HeaderCell>{key}</Table.HeaderCell>
                      )}
                      {row.map((value, i) => (
                        <Table.DataCell key={key + '-' + i}>{value}</Table.DataCell>
                      ))}
                    </Table.Row>
                  )
                })}
            </Table.Body>
          </Table>
        </div>
      )}
    </>
  )
}

export default ProductVariants
