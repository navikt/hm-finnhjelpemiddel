'use client'

import { Description } from '@/app/produkt/[id]/productInfo/GeneralProductInformation'
import { CompareColGroup } from '@/app/sammenlign/CompareColGroup'
import { CompareColumn, groupColumnsByProduct } from '@/app/sammenlign/compare-columns'

import React, { useState } from 'react'

import classNames from 'classnames'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, VStack } from '@navikt/ds-react'
import { TableDataCell, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { Heading, Table } from '@/components/aksel-client'

import styles from '@/app/sammenlign/CompareTable.module.scss'

export const CompareMetaDataTable = ({
  columns,
  productBoundaries,
}: {
  columns: CompareColumn[]
  productBoundaries: number[]
}) => {
  const [showTable, setShowTable] = useState(true)
  // Beskrivelse og leverandør gjelder hele hjelpemiddelet, så cellene spenner over alle kolonnene til produktet
  const productGroups = groupColumnsByProduct(columns)
  const hasVariantColumns = columns.some((column) => column.variant !== null)

  return (
    <VStack>
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
              {'Generelt'}
            </Heading>
            {showTable ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
          </HStack>
        </Button>
        {showTable && (
          <Table zebraStripes>
            <CompareColGroup columnCount={columns.length} />
            <Table.Body>
              <TableRow className={styles.alignTop}>
                <TableHeaderCell className="side_header">Beskrivelse</TableHeaderCell>
                {productGroups.map(({ product, columns: productColumns }, groupIndex) => (
                  <TableDataCell
                    key={product.id}
                    colSpan={productColumns.length}
                    className={classNames({ [styles.productBoundary]: groupIndex > 0 })}
                  >
                    <Description description={product.attributes.text} />
                  </TableDataCell>
                ))}
              </TableRow>
              <TableRow>
                <TableHeaderCell className="side_header">Leverandør</TableHeaderCell>
                {productGroups.map(({ product, columns: productColumns }, groupIndex) => (
                  <TableDataCell
                    key={product.id}
                    colSpan={productColumns.length}
                    className={classNames({ [styles.productBoundary]: groupIndex > 0 })}
                  >
                    {product.supplierName}
                  </TableDataCell>
                ))}
              </TableRow>
              {hasVariantColumns && (
                <TableRow>
                  <TableHeaderCell className="side_header">Lev-artnr</TableHeaderCell>
                  {columns.map(({ key, variant }, index) => (
                    <TableDataCell
                      key={key}
                      className={classNames({ [styles.productBoundary]: productBoundaries.includes(index) })}
                    >
                      {variant?.supplierRef ?? '-'}
                    </TableDataCell>
                  ))}
                </TableRow>
              )}
            </Table.Body>
          </Table>
        )}
      </Box>
    </VStack>
  )
}
