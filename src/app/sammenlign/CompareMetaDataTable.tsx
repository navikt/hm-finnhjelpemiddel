'use client'

import { Description } from '@/app/produkt/[id]/productInfo/GeneralProductInformation'
import { CompareColumn } from '@/app/sammenlign/compare-columns'

import React, { useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, VStack } from '@navikt/ds-react'
import { TableDataCell, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { Heading, Table } from '@/components/aksel-client'

import styles from '@/app/sammenlign/CompareTable.module.scss'

export const CompareMetaDataTable = ({ columns }: { columns: CompareColumn[] }) => {
  const [showTable, setShowTable] = useState(true)
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
            <Table.Body>
              <TableRow>
                <TableHeaderCell className="side_header">Beskrivelse</TableHeaderCell>
                {columns.map(({ key, product }) => (
                  <TableDataCell key={key}>
                    <Description description={product.attributes.text} />
                  </TableDataCell>
                ))}
              </TableRow>
              <TableRow>
                <TableHeaderCell className="side_header">Leverandør</TableHeaderCell>
                {columns.map(({ key, product }) => (
                  <TableDataCell key={key}>{product.supplierName}</TableDataCell>
                ))}
              </TableRow>
              {hasVariantColumns && (
                <TableRow>
                  <TableHeaderCell className="side_header">Lev-artnr</TableHeaderCell>
                  {columns.map(({ key, variant }) => (
                    <TableDataCell key={key}>{variant?.supplierRef ?? '-'}</TableDataCell>
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
