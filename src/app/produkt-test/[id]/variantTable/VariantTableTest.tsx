'use client'

import { Product, ProductVariant } from '@/utils/product-util'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { customSort, sortColumnsByRowKey } from '@/app/produkt/[id]/variantTable/variant-utils'
import { toValueAndUnit } from '@/utils/string-util'
import { ChevronDownIcon, ChevronUpIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Box, Button, CopyButton, Heading, HStack, Pagination, Table, VStack } from '@navikt/ds-react'
import productTop from '@/app/produkt/[id]/ProductTop.module.scss'
import styles from './VariantTableTest.module.scss'
import { VariantRankRow } from '@/app/produkt/[id]/variantTable/VariantRankRow'
import { VariantPostRow } from '@/app/produkt/[id]/variantTable/VariantPostRow'
import { groupTechDataKeys } from '@/app/produkt-test/[id]/ProductMiddleTest'
import { NeutralTag, SuccessTag } from '@/components/Tags'
import { FilterRowTest } from '@/app/produkt-test/[id]/variantTable/filters/FilterRowTest'
import { TechDataGroupTable } from '@/app/produkt-test/[id]/variantTable/TechDataGroupTable'

export type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

export type TechDataRow = {
  key: string
  values: string[]
  isCommonField: boolean
  unit: string | undefined
  type: string
}

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

export const VariantTableTest = ({ product }: { product: Product }) => {
  const sortColumns: SortColumns = { orderBy: 'Expired', direction: 'ascending' }
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)

  const [spaceNrvariants, setSpaceNrvariants] = useState<number>(1)

  const [pageState, setPageState] = useState<number>(1)
  const VARIANT_PAGE_MAX_SIZE = 5

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const updateNrVariants = () => {
      if (typeof window !== 'undefined') {
        const innerWidth = window.innerWidth
        const nrVariants = Math.max(1, Math.min(Math.floor((innerWidth - 250) / 180), VARIANT_PAGE_MAX_SIZE))

        setSpaceNrvariants((prevState) => {
          if (prevState !== nrVariants) {
            setPageState(1)
          }
          return nrVariants
        })
      }
    }

    updateNrVariants()

    window.addEventListener('resize', updateNrVariants)
  }, [])

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
    {
      fieldName: 'Forstørrelsesgrad min',
      label: 'Forstørrelsesgrad min',
      type: FilterType.DROPDOWN,
      predicate: dropdownFilterPredicate,
    },
    { fieldName: 'Setebredde', label: 'Setebredde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Setedybde', label: 'Setedybde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Setehøyde', label: 'Setehøyde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Bredde', label: 'Bredde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Terskelhøyde', label: 'Terskelhøyde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Lengde', label: 'Lengde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
    { fieldName: 'Dybde', label: 'Dybde', type: FilterType.DROPDOWN, predicate: dropdownFilterPredicate },
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

  const productVariantsSorted = sortColumnsByRowKey(productVariantsToShow, sortColumns).slice(
    (pageState - 1) * spaceNrvariants,
    (pageState - 1) * spaceNrvariants + spaceNrvariants
  )

  const currentMaxPageCount = Math.ceil(productVariantsToShow.length / spaceNrvariants)

  const allDataKeys =
    product.isoCategory === '18301505'
      ? [...new Set(productVariantsSorted.flatMap((variant) => Object.keys(variant.techData)))].sort(customSort)
      : [...new Set(productVariantsSorted.flatMap((variant) => Object.keys(variant.techData)))].sort()

  const techDataRowsAll: TechDataRow[] = allDataKeys.map((key) => {
    return {
      key: key,
      values: productVariantsSorted.map((variant) =>
        variant.techData[key] !== undefined
          ? toValueAndUnit(variant.techData[key].value, variant.techData[key].unit)
          : '-'
      ),
      isCommonField: product.variants.every(
        (variant) => variant.techData[key] && variant.techData[key].value === product.variants[0].techData[key].value
      ),
      unit: productVariantsSorted.find((variant) => variant.techData[key] !== undefined)?.techData[key].unit,
      type: productVariantsSorted.find((variant) => variant.techData[key] !== undefined)?.techData[key].type ?? '',
    }
  })

  const groupedTechData = groupTechDataKeys(product.variants)
  const groupedTechDataRows: { title: string; techDataRows: TechDataRow[] }[] = groupedTechData.map(
    ({ title, keys }) => {
      return {
        title: title,
        techDataRows: keys.map((key) => {
          return {
            key: key,
            values: productVariantsSorted.map((variant) =>
              variant.techData[key] !== undefined ? variant.techData[key].value : '-'
            ),
            isCommonField: product.variants.every(
              (variant) =>
                variant.techData[key] && variant.techData[key].value === product.variants[0].techData[key].value
            ),
            unit: productVariantsSorted.find((variant) => variant.techData[key] !== undefined)?.techData[key].unit,
            type:
              productVariantsSorted.find((variant) => variant.techData[key] !== undefined)?.techData[key].type ?? '',
          }
        }),
      }
    }
  )

  return (
    <Box background={'info-soft'} padding={'space-32'}>
      <Heading size={'medium'} level={'2'} spacing>
        Spesifikasjoner
      </Heading>
      {product.variants.length > 1 && (
        <VStack paddingBlock={'space-12 space-32'} id="variants-table">
          <FilterRowTest variants={product.variants} filterConfigs={filters} techDataRows={techDataRowsAll} />
        </VStack>
      )}
      {productVariantsSorted.length === 0 && (
        <Alert variant="warning" className="spacing-top--small">
          Ingen av variantene passer med filteret ditt
        </Alert>
      )}
      {productVariantsSorted.length > 0 && (
        <VStack>
          <div className={styles.variantsTable}>
            <VStack>
              <VStack gap={'space-8'} paddingBlock={'space-4 space-0'} className={styles.stickyTop}>
                {currentMaxPageCount > 1 && (
                  <HStack justify={'space-between'} align={'end'}>
                    <BodyShort>
                      Viser {productVariantsSorted.length} av {productVariantsToShow.length}
                    </BodyShort>
                    <Pagination
                      page={pageState}
                      onPageChange={setPageState}
                      count={currentMaxPageCount}
                      boundaryCount={1}
                      siblingCount={0}
                      size={'small'}
                    />
                  </HStack>
                )}
                <Table className={styles.stickyTable}>
                  <Table.Body>
                    <Table.Row>
                      <Table.HeaderCell>Navn på variant</Table.HeaderCell>
                      {productVariantsSorted.map((variant) => (
                        <Table.DataCell key={'artname-' + variant.id}>{variant.articleName}</Table.DataCell>
                      ))}
                    </Table.Row>

                    <Table.Row>
                      <Table.HeaderCell>HMS-nummer</Table.HeaderCell>
                      {productVariantsSorted.map((variant) => (
                        <Table.DataCell key={'hms-' + variant.id}>
                          {variant.hmsArtNr ? (
                            <CopyButton
                              size="small"
                              className={productTop.copyButton}
                              copyText={variant.hmsArtNr ?? ''}
                              text={variant.hmsArtNr ?? ''}
                              activeText="kopiert"
                              data-color={'accent'}
                              activeIcon={<ThumbUpIcon aria-hidden />}
                              iconPosition="right"
                            />
                          ) : (
                            <BodyShort align={'center'}>-</BodyShort>
                          )}
                        </Table.DataCell>
                      ))}
                    </Table.Row>
                  </Table.Body>
                </Table>
              </VStack>
              <MetaDataTable product={product} productVariants={productVariantsSorted} />
              {groupedTechDataRows.map(({ title, techDataRows }) => (
                <TechDataGroupTable title={title} techDataRows={techDataRows} key={title} />
              ))}
            </VStack>
          </div>
        </VStack>
      )}
    </Box>
  )
}

const MetaDataTable = ({ product, productVariants }: { product: Product; productVariants: ProductVariant[] }) => {
  const [showTable, setShowTable] = useState(true)

  const rankSet = new Set(product.agreements.map((agr) => agr.rank))
  const postSet = new Set(product.agreements.map((agr) => agr.postNr))

  const bestillingsordningVaries = new Set(product.variants.map((p) => p.bestillingsordning)).size === 2
  const digitalSoknadVaries = new Set(product.variants.map((p) => p.digitalSoknad)).size === 2
  //const hasHmsNumber = product.variants.some((p) => p.hmsArtNr)

  return (
    <VStack paddingBlock={'space-48'}>
      <Box className={styles.techDataGroup}>
        <Button
          variant="tertiary"
          data-color={'neutral'}
          onClick={() => setShowTable((value) => !value)}
          className={styles.expandTableButton}
          aria-expanded={showTable}
        >
          <HStack gap={'space-24'} justify={'space-between'} align={'center'}>
            <Heading size={'medium'} level={'3'} style={{ fontSize: '18px' }}>
              {'Avtaleinfo'}
            </Heading>
            {showTable ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
          </HStack>
        </Button>
        {showTable && (
          <Table zebraStripes>
            <Table.Body>
              <Table.Row>
                <Table.HeaderCell>På avtale</Table.HeaderCell>
                {productVariants.map((variant, _) => (
                  <Table.DataCell key={'på avtale-' + variant.id}>
                    {variant.status === 'INACTIVE' ? (
                      <NeutralTag>Utgått</NeutralTag>
                    ) : variant.hasAgreement ? (
                      <SuccessTag>På avtale</SuccessTag>
                    ) : (
                      <NeutralTag>Ikke på avtale</NeutralTag>
                    )}
                  </Table.DataCell>
                ))}
              </Table.Row>

              {rankSet.size > 1 && (
                <VariantRankRow variants={productVariants} selectedColumn={null} handleColumnClick={() => null} />
              )}
              {postSet.size > 1 && (
                <VariantPostRow variants={productVariants} selectedColumn={null} handleColumnClick={() => null} />
              )}
              <Table.Row>
                <Table.HeaderCell>Lev-artnr</Table.HeaderCell>
                {productVariants.map((variant, _) => (
                  <Table.DataCell key={'levart-' + variant.id}>{variant.supplierRef ?? '-'}</Table.DataCell>
                ))}
              </Table.Row>
              {bestillingsordningVaries && (
                <Table.Row>
                  <Table.HeaderCell>Bestillingsordning</Table.HeaderCell>
                  {productVariants.map((variant, _) => (
                    <Table.DataCell key={'bestillingsordning-' + variant.id}>
                      {variant.bestillingsordning ? 'Ja' : 'Nei'}
                    </Table.DataCell>
                  ))}
                </Table.Row>
              )}
              {digitalSoknadVaries && (
                <Table.Row>
                  <Table.HeaderCell>Digital behovsmelding</Table.HeaderCell>
                  {productVariants.map((variant, _) => (
                    <Table.DataCell key={'behovsmelding-' + variant.id}>
                      {variant.digitalSoknad ? 'Ja' : 'Nei'}
                    </Table.DataCell>
                  ))}
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </Box>
    </VStack>
  )
}
