'use client'

import { useEffect, useRef, useState } from 'react'

import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@navikt/aksel-icons'
import { Alert, BodyLong, Chips, Heading, HStack, Loader, Table } from '@navikt/ds-react'
import { FilterViewProductPage } from '@/components/filters/FilterViewProductPage'
import { fetchProducts, FetchProductsWithFilters, Filter, FilterData, getProductFilters } from '@/utils/api-util'
import { FilterFormState, filtersFormStateLabel, initialFiltersFormState } from '@/utils/filter-util'
import { mapSearchParams, toSearchQueryString } from '@/utils/mapSearchParams'
import { Product } from '@/utils/product-util'
import { toValueAndUnit } from '@/utils/string-util'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { egenskaperText, hasDifferentValues, sortColumnsByRowKey } from "@/app/produkt/variants/variant-utils";
import { VariantStatusRow } from "@/app/produkt/variants/VariantStatusRow";
import { VariantNameRow } from "@/app/produkt/variants/VariantNameRow";
import VariantHmsNumberRow from "@/app/produkt/variants/VariantHmsNumberRow";
import { VariantSupplierRefRow } from "@/app/produkt/variants/VariantSupplierRefRow";
import { VariantRankRow } from "@/app/produkt/variants/VariantRankRowProps";
import { VariantPostRow } from "@/app/produkt/variants/VariantPostRow";
import { VariantTechnicalDataRow } from "@/app/produkt/variants/VariantTechnicalDataRow";

export type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

export type FilterFormStateProductPage = {
  filters: FilterFormState
}

const MultipleVariantsTable = ({ product }: { product: Product }) => {
  const [sortColumns, setSortColumns] = useState<SortColumns>({
    orderBy: 'Expired',
    direction: 'ascending',
  })

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchData = mapSearchParams(searchParams)
  const searchTerm = searchParams.get('term')

  const variantNameElementRef = useRef<HTMLTableCellElement>(null)

  const [variantNameElementHeight, setVariantNameElementHeight] = useState(0)

  useEffect(() => {
    if (variantNameElementRef.current) {
      setVariantNameElementHeight(variantNameElementRef.current.offsetHeight)
    }
  }, [])

  const handleResize = () => {
    if (variantNameElementRef.current) {
      setVariantNameElementHeight(variantNameElementRef.current.offsetHeight)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize, false)
  }, [])

  const {
    data: dataAndFilter,
  } = useSWR<FetchProductsWithFilters>(
    {
      from: 0,
      size: 150,
      searchData: {
        ...searchData,
        searchTerm: '',
      },
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

  useEffect(() => {
    let relevantFilters = {
      ...initialFiltersFormState,
      ...Object.fromEntries(
        Object.entries(searchData.filters).filter(([key]) => {
          // Det er forskjellig navn på filterene for bredde og lengde i filterdata og i searchData
          // så vi må sjekke om de eksisterer manuelt
          if (['breddeMinCM', 'breddeMaxCM'].includes(key)) {
            return relevantFilterKeys.includes('breddeCM')
          } else if (['lengdeMinCM', 'lengdeMaxCM'].includes(key)) {
            return relevantFilterKeys.includes('lengdeCM')
          } else if (key === 'status') {
            return true
          } else if (['totalVektMinKG', 'totalVektMaxKG'].includes(key)) {
            return relevantFilterKeys.includes('totalVektKG')
          } else if (['brukervektMinKG', 'brukervektMaxKG'].includes(key)) {
            return relevantFilterKeys.includes('brukervektKG')
          } else {
            return relevantFilterKeys.includes(key)
          }
        })
      ),
    }

    const currentHash = window.location.hash
    const newQueryString = toSearchQueryString({ filters: relevantFilters }, searchData.searchTerm)
    router.replace(`${pathname}?${newQueryString}${currentHash ? currentHash : ''}`, {
      scroll: false,
    })
  }, [filtersFromData])

  const formMethods = useForm<FilterFormStateProductPage>({
    mode: 'onSubmit',
    shouldFocusError: false,
    values: {
      filters: { ...initialFiltersFormState, ...searchData.filters },
    },
  })

  const onSubmit = () => {
    const currentHash = window.location.hash
    const newQueryString = toSearchQueryString({ filters: formMethods.getValues().filters }, searchData.searchTerm)
    router.replace(`${pathname}?${newQueryString}${currentHash ? currentHash : ''}`, {
      scroll: false,
    })
  }

  const onRemoveSearchTerm = () => {
    const currentHash = window.location.hash
    const newQueryString = toSearchQueryString({ filters: formMethods.getValues().filters }, '')
    router.replace(`${pathname}?${newQueryString}${currentHash ? currentHash : ''}`, {
      scroll: false,
    })
  }

  const numberOfvariantsOnAgreement = product.variants.filter(
    (variant) => variant.hasAgreement === true && variant.status === 'ACTIVE'
  ).length
  const numberOfvariantsWithoutAgreement = product.variantCount - numberOfvariantsOnAgreement
  const numberOfvariantsExpired = product.variants.filter((variant) => variant.status === 'INACTIVE').length

  const moreThanOneStatus =
    [numberOfvariantsExpired, numberOfvariantsOnAgreement, numberOfvariantsWithoutAgreement].filter((num) => num > 0)
      .length > 1

  const statusFilter: Filter = {
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

  const searchTermMatchesHms = product.variants
    .flatMap((variant) => [variant.hmsArtNr?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())
  const searchTermMatchesSupplierRef = product.variants
    .flatMap((variant) => [variant.supplierRef?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())

  var productWithFilteredVariants = dataAndFilter && dataAndFilter.products
  const filters = filtersFromData ? { ...filtersFromData, status: statusFilter } : filtersFromData


  let productVariantsToShow = productWithFilteredVariants
    ? productWithFilteredVariants.length > 0
      ? searchTermMatchesHms
        ? productWithFilteredVariants[0].variants.filter((variant) => variant.hmsArtNr === searchData.searchTerm)
        : searchTermMatchesSupplierRef
          ? productWithFilteredVariants[0].variants.filter((variant) => variant.supplierRef === searchData.searchTerm)
          : productWithFilteredVariants[0].variants
      : []
    : product.variants

  useEffect(() => {
    if (variantNameElementRef.current) {
      setVariantNameElementHeight(variantNameElementRef.current.offsetHeight)
    }
  }, [productVariantsToShow])

  let sortedByKey = sortColumnsByRowKey(productVariantsToShow, sortColumns)

  // Spesifikk rekkefølge av bestemte rader for Terskeleliminatorer med ISO 18301505.
  // De radene som bør komme etter hverandre er: "Bredde",  "Terskelhøyde maks",  "Terskelhøyde min"

  const customOrder = ['Belastning maks', 'Bredde', 'Terskelhøyde maks', 'Terskelhøyde min']

  const customSort = (a: string, b: string) => {
    const indexA = customOrder.indexOf(a)
    const indexB = customOrder.indexOf(b)

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b)
    }
    if (indexA === -1) {
      return 1
    }
    if (indexB === -1) {
      return -1
    }
    return indexA - indexB
  }

  const allDataKeys =
    product.isoCategory === '18301505' // ISO 18301505 er Terskeleliminatorer
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

  type ExtendedFilterFormState = FilterFormState & {
    'HMS-nummer': unknown
    'Lev-artnr': unknown
  }

  const showTermTag = searchTermMatchesHms || searchTermMatchesSupplierRef

  const filterChips = Object.entries(searchData.filters)
    .filter(([key, values]) => values.length > 0 && key !== 'status')
    .flatMap(([key, values]) => ({
      key: key as keyof ExtendedFilterFormState,
      values: Array.isArray(values) ? values.join(', ') : values,
      label: filtersFormStateLabel[key as keyof FilterFormState],
    }))
    .concat(
      searchData.searchTerm && showTermTag
        ? [
          {
            key: searchTermMatchesHms ? 'HMS-nummer' : 'Lev-artnr',
            values: searchData.searchTerm,
            label: searchTermMatchesHms ? 'HMS-nummer' : 'Lev-artnr',
          },
        ]
        : []
    )

  return (
    <>
      <BodyLong className="spacing-bottom--medium">
        {egenskaperText(
          product.title,
          product.variantCount,
          numberOfvariantsOnAgreement,
          numberOfvariantsWithoutAgreement
        )}
      </BodyLong>

      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} aria-controls="variants-table">
          {filterIsLoading && (
            <HStack style={{ margin: '38px' }}>
              <Loader size="xlarge" title="Laster bilde" />
            </HStack>
          )}
          {(relevantFilterKeys.length > 0 || moreThanOneStatus) && <FilterViewProductPage filters={filters} />}
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

      <Heading
        level="3"
        size="small"
        className="spacing-vertical--small"
      >{`${productVariantsToShow.length} av ${product.variantCount} varianter:`}</Heading>

      {productVariantsToShow.length === 0 && (
        <Alert variant="warning" className="spacing-top--small">
          Ingen av variantene passer med filteret ditt
        </Alert>
      )}

      {productVariantsToShow.length > 0 && (
        <div className="variants-table" id="variants-table">
          <Table zebraStripes>
            <Table.Header>
             <VariantStatusRow variants={sortedByKey} />
              <VariantNameRow variants={sortedByKey} sortColumns={sortColumns} handleSortRow={handleSortRow} variantNameElementRef={variantNameElementRef} />
            </Table.Header>
            <Table.Body>
              <VariantHmsNumberRow
                sortedByKey={sortedByKey}
                sortColumns={sortColumns}
                handleSortRow={handleSortRow}
                variantNameElementHeight={variantNameElementHeight}
              />
              <VariantSupplierRefRow
                sortedByKey={sortedByKey}
                sortColumns={sortColumns}
                handleSortRow={handleSortRow}
              />

              {product.agreements && product.agreements.length > 0 && (
               <>
                 <VariantRankRow
                   sortedByKey={sortedByKey}
                   sortColumns={sortColumns}
                   handleSortRow={handleSortRow}
                   sortRank={sortRank}
                   hasAgreementSet={hasAgreementSet}
                 />
                 <VariantPostRow
                   sortedByKey={sortedByKey}
                   sortColumns={sortColumns}
                   handleSortRow={handleSortRow}
                   postSet={postSet}
                   sortRank={sortRank}
                 />
               </>
              )}

              <Table.Row>
                <Table.HeaderCell>Bestillingsordning</Table.HeaderCell>
                {sortedByKey.map((variant) => (
                  <Table.DataCell key={'bestillingsordning-' + variant.id}>
                    {variant.bestillingsordning ? 'Ja' : 'Nei'}
                  </Table.DataCell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Digital behovsmelding</Table.HeaderCell>
                {sortedByKey.map((variant) => (
                  <Table.DataCell key={'behovsmelding-' + variant.id}>
                    {variant.digitalSoknad ? 'Ja' : 'Nei'}
                  </Table.DataCell>
                ))}
              </Table.Row>
              {Object.keys(rows).length > 0 &&
                Object.entries(rows).map(([key, row], i) => {
                  const isSortableRow = hasDifferentValues({ row });
                  return (
                    <VariantTechnicalDataRow
                      key={key}
                      technicalDataName={key}
                      row={row}
                      sortColumns={sortColumns}
                      handleSortRow={handleSortRow}
                      isSortableRow={isSortableRow}
                      iconBasedOnState={iconBasedOnState}
                    />
                  );
                })}
            </Table.Body>
          </Table>
        </div>
      )}
    </>
  )
}

export default MultipleVariantsTable
