'use client'

import { Fragment, useState } from 'react'

import classNames from 'classnames'

import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@navikt/aksel-icons'
import { BodyLong, Button, Heading, Table } from '@navikt/ds-react'

import { Product, ProductVariant } from '@/utils/product-util'
import { sortIntWithStringFallback } from '@/utils/sort-util'
import { toValueAndUnit } from '@/utils/string-util'

type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

const ProductVariants = ({ product }: { product: Product }) => {
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

  let sortedByKey = sortColumnsByRowKey(product.variants)
  const allDataKeys = [...new Set(sortedByKey.flatMap((variant) => Object.keys(variant.techData)))]
  const techDataKeys = product.attributes.commonCharacteristics
    ? allDataKeys.filter((key) => product.attributes.commonCharacteristics![key] === undefined)
    : allDataKeys

  const rows: { [key: string]: string[] } = Object.assign(
    {},
    ...techDataKeys.map((key) => ({
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

  const numberOfvariantsOnAgreement = product.variants.filter((variant) => variant.hasAgreement === true).length
  const numberOfvariantsWithoutAgreement = product.variantCount - numberOfvariantsOnAgreement

  const textAllVariantsOnAgreement = `${product.title} finnes i ${numberOfvariantsOnAgreement} ${
    numberOfvariantsOnAgreement === 1 ? 'variant' : 'varianter'
  } på avtale med NAV.`
  const textViantsWithAndWithoutAgreement = `${
    product.title
  } finnes i ${numberOfvariantsOnAgreement} varianter på avtale med NAV, og ${numberOfvariantsWithoutAgreement} ${
    numberOfvariantsWithoutAgreement === 1 ? 'variant' : 'varianter'
  } som ikke er på avtale med NAV.`

  return (
    <>
      <Heading id="product_variants" level="3" size="medium" spacing>
        Produktvarianter
      </Heading>
      {product.variantCount > 1 && (
        <BodyLong>
          {numberOfvariantsWithoutAgreement > 0 ? textViantsWithAndWithoutAgreement : textAllVariantsOnAgreement}{' '}
          Nedenfor finner man en oversikt over de forskjellige variantene. Radene der variantene har ulike verdier kan
          sorteres og vil fremheves når de er sortert.
        </BodyLong>
      )}

      <div className="comparing-table">
        <Table>
          <Table.Header>
            <Table.Row>
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
                <Table.DataCell key={variant.id}>{variant.hmsArtNr ?? '-'}</Table.DataCell>
              ))}
            </Table.Row>

            {product.agreements && product.agreements.length > 0 && (
              <Table.Row>
                <Table.HeaderCell>Rangering</Table.HeaderCell>
                {/*Midlertidig løsning: Vi bør finne en måte å vise at et produkt kan være på flere avtaler i tabellen */}
                {sortedByKey.map((variant) => (
                  <Fragment key={variant.id}>
                    {variant.agreements?.length === 1 && (
                      <Table.DataCell key={variant.id}>{variant.agreements[0]?.rank ?? '-'}</Table.DataCell>
                    )}

                    {variant.agreements?.length && variant.agreements?.length > 1 && (
                      <Table.DataCell key={variant.id}>Ulik rangering på ulike poster</Table.DataCell>
                    )}
                  </Fragment>
                ))}
              </Table.Row>
            )}

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

export default ProductVariants
