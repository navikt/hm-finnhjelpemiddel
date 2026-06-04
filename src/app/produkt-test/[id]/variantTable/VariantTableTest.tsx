'use client'

import { Product, ProductVariant } from '@/utils/product-util'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { customSort, sortColumnsByRowKey } from '@/app/produkt/[id]/variantTable/variant-utils'
import { toValueAndUnit } from '@/utils/string-util'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Box, Button, CopyButton, Heading, HStack, Table, VStack } from '@navikt/ds-react'
import { FilterRow } from '@/app/produkt/[id]/variantTable/FilterRow'
import productTop from '@/app/produkt/[id]/ProductTop.module.scss'
import styles from './VariantTableTest.module.scss'
import { VariantStatusRowNew } from '@/app/produkt/[id]/variantTable/VariantStatusRowNew'
import { VariantRankRow } from '@/app/produkt/[id]/variantTable/VariantRankRow'
import { VariantPostRow } from '@/app/produkt/[id]/variantTable/VariantPostRow'
import { groupTechDataKeys } from '@/app/produkt-test/[id]/ProductMiddleTest'

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

export const VariantTableTest = ({ product }: { product: Product }) => {
  const sortColumns: SortColumns = { orderBy: 'Expired', direction: 'ascending' }
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const variantNameElementRef = useRef<HTMLTableCellElement>(null)

  const [variantCursor, setVariantCursor] = useState<number>(0)
  const VARIANT_PAGE_MAX_SIZE = 5

  const [spaceNrvariants, setSpaceNrvariants] = useState<number>(1)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const updateNrVariants = () => {
      if (typeof window !== 'undefined') {
        const innerWidth = window.innerWidth
        const nrVariants = Math.max(1, Math.min(Math.floor((innerWidth - 250) / 200), VARIANT_PAGE_MAX_SIZE))
        setSpaceNrvariants(nrVariants)
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
    variantCursor,
    variantCursor + spaceNrvariants
  )

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
          }
        }),
      }
    }
  )

  const rankSet = new Set(product.agreements.map((agr) => agr.rank))
  const postSet = new Set(product.agreements.map((agr) => agr.postNr))

  const bestillingsordningVaries = new Set(product.variants.map((p) => p.bestillingsordning)).size === 2
  const digitalSoknadVaries = new Set(product.variants.map((p) => p.digitalSoknad)).size === 2
  const hasHmsNumber = product.variants.some((p) => p.hmsArtNr)

  const updateVariantCursor = (delta: number) => {
    setVariantCursor((prevState) => {
      const newValue = prevState + delta

      return Math.min(productVariantsToShow.length - spaceNrvariants, Math.max(0, newValue))
    })
  }

  return (
    <Box>
      {product.variants.length > 1 && (
        <VStack paddingBlock={'space-0 space-32'}>
          <FilterRow
            variants={product.variants}
            filterConfigs={filters}
            techDataRows={techDataRowsAll}
            numberOfVariantsToShow={productVariantsToShow.length}
          />
        </VStack>
      )}
      {productVariantsSorted.length === 0 && (
        <Alert variant="warning" className="spacing-top--small">
          Ingen av variantene passer med filteret ditt
        </Alert>
      )}
      {productVariantsSorted.length > 0 && (
        <VStack>
          <Heading size={'medium'} level={'2'} spacing>
            Spesifikasjoner
          </Heading>
          <HStack>
            <Button
              aria-label="Vis forrige"
              variant="tertiary"
              onClick={() => updateVariantCursor(-spaceNrvariants)}
              icon={<ChevronLeftIcon aria-hidden height={40} width={40} />}
              disabled={variantCursor === 0}
            />
            <Button
              aria-label="Vis neste"
              variant="tertiary"
              onClick={() => updateVariantCursor(spaceNrvariants)}
              icon={<ChevronRightIcon aria-hidden height={40} width={40} />}
              disabled={variantCursor >= productVariantsToShow.length - spaceNrvariants}
            />
          </HStack>
          <div className={styles.variantsTable} id="variants-table">
            <Table>
              <Table.Header>
                <VariantStatusRowNew variants={productVariantsSorted} />
                <Table.Row>
                  <Table.ColumnHeader ref={variantNameElementRef}>Navn på variant</Table.ColumnHeader>
                  {productVariantsSorted.map((variant) => (
                    <Table.ColumnHeader key={'artname-' + variant.id}>{variant.articleName}</Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {hasHmsNumber && (
                  <Table.Row>
                    <Table.HeaderCell>HMS-nummer</Table.HeaderCell>
                    {productVariantsSorted.map((variant, i) => (
                      <Table.DataCell key={'hms-' + variant.id}>
                        {variant.hmsArtNr ? (
                          <CopyButton
                            size="small"
                            className={productTop.copyButton}
                            copyText={variant.hmsArtNr ?? ''}
                            text={variant.hmsArtNr ?? ''}
                            activeText="kopiert"
                            variant="action"
                            activeIcon={<ThumbUpIcon aria-hidden />}
                            iconPosition="right"
                          />
                        ) : (
                          <BodyShort align={'center'}>-</BodyShort>
                        )}
                      </Table.DataCell>
                    ))}
                  </Table.Row>
                )}
                <Table.Row>
                  <Table.HeaderCell>Lev-artnr</Table.HeaderCell>
                  {productVariantsSorted.map((variant, i) => (
                    <Table.DataCell key={'levart-' + variant.id}>
                      {variant.supplierRef ? (
                        <CopyButton
                          size="small"
                          className={productTop.copyButton}
                          copyText={variant.supplierRef}
                          text={variant.supplierRef}
                          activeText="kopiert"
                          variant="action"
                          activeIcon={<ThumbUpIcon aria-hidden />}
                          iconPosition="right"
                        />
                      ) : (
                        <BodyShort align={'center'}>-</BodyShort>
                      )}
                    </Table.DataCell>
                  ))}
                </Table.Row>
                {rankSet.size > 1 && (
                  <VariantRankRow
                    variants={productVariantsSorted}
                    selectedColumn={null}
                    handleColumnClick={() => null}
                  />
                )}
                {postSet.size > 1 && (
                  <VariantPostRow
                    variants={productVariantsSorted}
                    selectedColumn={null}
                    handleColumnClick={() => null}
                  />
                )}
                {bestillingsordningVaries && (
                  <Table.Row>
                    <Table.HeaderCell>Bestillingsordning</Table.HeaderCell>
                    {productVariantsSorted.map((variant, i) => (
                      <Table.DataCell key={'bestillingsordning-' + variant.id}>
                        {variant.bestillingsordning ? 'Ja' : 'Nei'}
                      </Table.DataCell>
                    ))}
                  </Table.Row>
                )}
                {digitalSoknadVaries && (
                  <Table.Row>
                    <Table.HeaderCell>Digital behovsmelding</Table.HeaderCell>
                    {productVariantsSorted.map((variant, i) => (
                      <Table.DataCell key={'behovsmelding-' + variant.id}>
                        {variant.digitalSoknad ? 'Ja' : 'Nei'}
                      </Table.DataCell>
                    ))}
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
            <VStack paddingBlock={'space-32 space-0'}>
              {groupedTechDataRows.map(({ title, techDataRows }) => (
                <TechDataGroupRows title={title} techDataRows={techDataRows} key={title} />
              ))}
            </VStack>
          </div>
        </VStack>
      )}
    </Box>
  )
}

const mergeMinMaksValues = (min: string[], maks: string[]): string[] => {
  return min.map((minValue, index) => {
    const maksValue = maks[index]
    if (minValue === maksValue) {
      return minValue
    } else {
      return minValue + `-${maks[index]}`
    }
  })
}

const TechDataGroupRows = ({ title, techDataRows }: { title: string; techDataRows: TechDataRow[] }) => {
  const [showTable, setShowTable] = useState(true)

  const rowsMerged: TechDataRow[] = []

  const allRowKeys = new Set(techDataRows.map(({ key }) => key))

  techDataRows.forEach((techDataRow) => {
    if (techDataRow.key.endsWith(' min')) {
      const baseKey = techDataRow.key.split(' min')[0]
      const maksRow = techDataRows.find((otherRow) => otherRow.key === `${baseKey} maks`)

      if (maksRow !== undefined) {
        rowsMerged.push({
          isCommonField: techDataRow.isCommonField,
          key: baseKey,
          unit: techDataRow.unit,
          values: mergeMinMaksValues(techDataRow.values, maksRow.values),
        })
      } else {
        rowsMerged.push(techDataRow)
      }
    } else if (techDataRow.key.endsWith(' maks') && `${allRowKeys.has(techDataRow.key.split(' maks')[0])} min`) {
      //er slått sammen med min-raden
    } else if (allRowKeys.has(`${techDataRow.key} min`)) {
      //for å slippe f.eks duplikat setedybde på Arbeidsstoler med manuell seteløfter
    } else {
      rowsMerged.push(techDataRow)
    }
  })

  if (rowsMerged.length < 1) {
    return <></>
  }

  return (
    <Box className={styles.techDataGroup}>
      <Button
        variant="tertiary"
        data-color={'neutral'}
        onClick={() => setShowTable((value) => !value)}
        className={styles.expandTableButton}
        icon={
          showTable ? (
            <ChevronUpIcon fontSize={'24px'} aria-hidden />
          ) : (
            <ChevronDownIcon fontSize={'24px'} aria-hidden />
          )
        }
        iconPosition={'right'}
      >
        <BodyShort weight={'semibold'}>{title}</BodyShort>
      </Button>
      {showTable && (
        <Table zebraStripes width={'100%'}>
          <Table.Body>
            {rowsMerged
              .sort((a, b) => a.key.localeCompare(b.key))
              .map(({ key, values, unit }) => {
                return (
                  <Table.Row key={key + 'row'}>
                    <Table.HeaderCell>{key}</Table.HeaderCell>
                    {values.map((value, i) => (
                      <Table.DataCell key={key + '-' + i}>{toValueAndUnit(value, unit)}</Table.DataCell>
                    ))}
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>
      )}
    </Box>
  )
}
