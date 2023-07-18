'use client'

import { useState } from 'react'

import classNames from 'classnames'

import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Heading, Table } from '@navikt/ds-react'

import { ProductVariant, ProductWithVariants } from '@/utils/product-util'
import { sortIntWithStringFallback } from '@/utils/sort-util'
import { capitalize, toValueAndUnit } from '@/utils/string-util'

type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

const SimilarProducts = ({ product }: { product: ProductWithVariants }) => {
  const [sortColumns, setSortColumns] = useState<SortColumns>({ orderBy: 'HMS', direction: 'ascending' })

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
      if (
        sortColumns.orderBy &&
        variantA.techData[sortColumns.orderBy].value &&
        variantB.techData[sortColumns.orderBy].value
      ) {
        return sortIntWithStringFallback(
          variantA.techData[sortColumns.orderBy].value,
          variantB.techData[sortColumns.orderBy].value,
          sortColumns.direction === 'descending'
        )
      } else return -1
    })
  }

  let sortedByKey = sortColumnsByRowKey(product.variants)

  const allDataKeys = [...new Set(sortedByKey.flatMap((variant) => Object.keys(variant.techData)))].filter(
    (key) => !product.attributes.commonCharacteristics?.find((common) => common.key === key)
  )

  const rows: { [key: string]: string[] } = Object.assign(
    {},
    ...allDataKeys.map((key) => ({
      [key]: product.variants.map((variant) =>
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

  const variantTitle = (title: string) => {
    const replacedStr = title.replace(product.title, '')
    return replacedStr === '' ? '-' : replacedStr
  }

  return (
    <>
      <Heading id="product_variants" level="3" size="medium" spacing>
        Produktvarianter
      </Heading>
      <BodyShort>
        Produktet finnes i flere varianter, under finner man en oversikt over de forskjellige. Radene hvor
        produktvariantene har forskjellige verdier kan sorteres og vil fremheves når de er sortert.
      </BodyShort>

      <div className="comparing-table">
        <Table>
          <Table.Header>
            <Table.Row key="hms-row">
              <Table.ColumnHeader>Tittel</Table.ColumnHeader>
              {sortedByKey.map((variant) => (
                <Table.ColumnHeader key={variant.id}>{variantTitle(variant.articleName)}</Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell>HMS-nummer</Table.HeaderCell>
              {sortedByKey.map((variant) => (
                <Table.DataCell key={variant.id}>{variant.hmsArtNr}</Table.DataCell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Lev-artnr</Table.HeaderCell>
              {sortedByKey.map((variant) => (
                <Table.DataCell key={variant.id}>{variant.supplierRef}</Table.DataCell>
              ))}
            </Table.Row>
            {Object.keys(rows).length > 0 &&
              Object.entries(rows).map(([key, row], i) => {
                const isSortableRow = hasDifferentValues({ row })
                return (
                  <Table.Row
                    key={key + 'row' + i}
                    className={classNames(
                      { 'comparing-table__sorted-row': key === sortColumns.orderBy },
                      { 'comparing-table__sortable-row': isSortableRow }
                    )}
                  >
                    <Table.HeaderCell>
                      {isSortableRow ? (
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
                      ) : (
                        key
                      )}
                    </Table.HeaderCell>
                    {row.map((value, i) => (
                      <Table.DataCell key={key + '-' + i}>{value}</Table.DataCell>
                    ))}
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>
      </div>
    </>
  )
}

export default SimilarProducts
