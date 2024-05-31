'use client'

import { Fragment, useEffect, useState } from 'react'

import classNames from 'classnames'

import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { Alert, BodyLong, Button, Chips, CopyButton, Heading, Table, Tag, VStack } from '@navikt/ds-react'

import { viewAgreementRanks } from '@/components/AgreementIcon'
import { FilterViewProductPage } from '@/components/filters/FilterViewProductPage'
import { fetchProducts, FetchProductsWithFilters, Filter, FilterData, getProductFilters } from '@/utils/api-util'
import { FilterFormState, filtersFormStateLabel, initialFiltersFormState } from '@/utils/filter-util'
import { mapSearchParams, toSearchQueryString } from '@/utils/mapSearchParams'
import { Product } from '@/utils/product-util'
import { toValueAndUnit } from '@/utils/string-util'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { egenskaperText, hasDifferentValues, sortColumnsByRowKey } from './utils'

export type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

export type FilterFormStateProductPage = {
  filters: FilterFormState
}

const ProductVariants = ({ product }: { product: Product }) => {
  const [sortColumns, setSortColumns] = useState<SortColumns>({
    orderBy: 'Expired',
    direction: 'ascending',
  })
  const [searchTermIsHms, setSearchTermIsHms] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const anyExpired = product.variants.some((product) => product.status === 'INACTIVE')
  const searchData = mapSearchParams(searchParams)
  const searchTerm = searchParams.get('term')

  const {
    data: dataAndFilter,
    isLoading: dataIsLoading,
    error: dataError,
  } = useSWR<FetchProductsWithFilters>(
    {
      from: 0,
      size: 150,
      searchData: searchData,
      dontCollapse: true,
      seriesId: product.id,
    },
    fetchProducts,
    { keepPreviousData: true }
  )

  const { data: filtersFromData, isLoading: filterIsLoading } = useSWR<FilterData>(
    { seriesId: product.id },
    getProductFilters,
    {
      keepPreviousData: true,
    }
  )

  // Alle filtre man får med fra søket er ikke relevante for alle produkter
  // så vi filtrerer ut de som ikke er relevante
  const relevantFilterKeys = filtersFromData
    ? Object.entries(filtersFromData)
        .filter(([_, filter]) => filter.values.length > 1)
        .flatMap(([key]) => key)
    : []

  let relevantFilters: FilterFormState = initialFiltersFormState

  useEffect(() => {
    relevantFilters = {
      ...initialFiltersFormState,
      ...Object.fromEntries(
        Object.entries(searchData.filters).filter(([key]) => {
          // Det er forskjellig navn på filterene for bredde og lengde i filterdata og i searchData
          // så vi må sjekke om de eksisterer manuelt
          if (['breddeMinCM', 'breddeMaxCM'].includes(key)) {
            return relevantFilterKeys.includes('breddeCM')
          } else if (['lengdeMinCM', 'lengdeMaxCM'].includes(key)) {
            return relevantFilterKeys.includes('lengdeCM')
          } else if (key === 'vis') {
            return true
          } else {
            return relevantFilterKeys.includes(key)
          }
        })
      ),
    }

    const hmsNumbers = product.variants.flatMap((variant) => [variant.hmsArtNr?.toLocaleLowerCase()])
    const supplierRefs = product.variants.flatMap((variant) => [variant.supplierRef?.toLocaleLowerCase()])
    const isSearchTermInHms = hmsNumbers.includes(searchData.searchTerm?.toLowerCase())
    if (isSearchTermInHms) setSearchTermIsHms(true)
    const isSearchTermInSupplierRef = supplierRefs.includes(searchData.searchTerm?.toLowerCase())

    router.replace(
      `${pathname}?${toSearchQueryString({ filters: relevantFilters }, isSearchTermInHms || isSearchTermInSupplierRef ? searchData.searchTerm : '')}`,
      {
        scroll: false,
      }
    )
  }, [filtersFromData])

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

  const numberOfvariantsOnAgreement = product.variants.filter((variant) => variant.hasAgreement === true).length
  const numberOfvariantsWithoutAgreement = product.variantCount - numberOfvariantsOnAgreement
  const numberOfvariantsExpired = product.variants.filter((variant) => variant.status === 'INACTIVE').length

  const filterVis: Filter = {
    values: [
      {
        key: 'På avtale',
        doc_count: numberOfvariantsOnAgreement,
      },
      {
        key: 'Ikke på avtale',
        doc_count: numberOfvariantsWithoutAgreement,
      },
      {
        key: 'Utgått',
        doc_count: numberOfvariantsExpired,
      },
    ],
  }

  const productWithFilteredVariants = dataAndFilter && dataAndFilter.products
  const filters = filtersFromData ? { ...filtersFromData, vis: filterVis } : filtersFromData

  const productVariants = productWithFilteredVariants
    ? productWithFilteredVariants.length > 0
      ? productWithFilteredVariants[0].variants
      : []
    : product.variants

  let sortedByKey = sortColumnsByRowKey(productVariants, sortColumns)
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

  type ExtendedFilterFormState = FilterFormState & {
    'HMS-nummer': unknown
    'Lev-artnr': unknown
  }

  const filterChips = Object.entries(searchData.filters)
    .filter(([_, values]) => values.length > 0)
    .flatMap(([key, values]) => ({
      key: key as keyof ExtendedFilterFormState,
      values: Array.isArray(values) ? values.join(', ') : values,
      label: filtersFormStateLabel[key as keyof FilterFormState],
    }))
    .concat(
      searchData.searchTerm
        ? [
            {
              key: searchTermIsHms ? 'HMS-nummer' : 'Lev-artnr',
              values: searchData.searchTerm,
              label: searchTermIsHms ? 'HMS-nummer' : 'Lev-artnr',
            },
          ]
        : []
    )

  const onRemoveSearchTerm = () => {
    router.replace(`${pathname}?${toSearchQueryString({ filters: formMethods.getValues().filters }, '')}`, {
      scroll: false,
    })
  }

  return (
    <>
      <Heading level="2" size="large" spacing>
        Egenskaper
      </Heading>
      <BodyLong className="spacing-bottom--medium">
        {egenskaperText(
          product.title,
          product.variantCount,
          numberOfvariantsOnAgreement,
          numberOfvariantsWithoutAgreement
        )}
      </BodyLong>

      {product.variantCount > 1 && (
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} aria-controls="variants-table">
            {relevantFilterKeys.length > 0 && <FilterViewProductPage filters={filters} />}
            <input type="submit" style={{ display: 'none' }} />

            {(searchTerm || filterChips.length > 0) && (
              <Chips className="spacing-bottom--medium">
                {filterChips.map(({ key, label, values }, i) => {
                  return (
                    <Chips.Removable
                      key={key + i}
                      onClick={(event) => {
                        if (key === 'HMS-nummer' || key === 'Lev-artnr') {
                          onRemoveSearchTerm()
                        } else {
                          formMethods.setValue(`filters.${key}`, '')
                          event.currentTarget?.form?.requestSubmit()
                        }
                      }}
                    >
                      {`${label}: ${values}`}
                    </Chips.Removable>
                  )
                })}
              </Chips>
            )}
          </form>
        </FormProvider>
      )}

      {product.variantCount > 1 && (
        <Heading
          level="3"
          size="small"
          className={classNames({ 'spacing-bottom--small': !anyExpired })}
        >{`${productVariants.length} av ${product.variantCount} varianter:`}</Heading>
      )}

      {productVariants.length === 0 && (
        <Alert variant="warning" className="spacing-top--small">
          Ingen av variantene matcher filteret ditt
        </Alert>
      )}

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
