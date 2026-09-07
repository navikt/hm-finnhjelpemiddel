'use client'

import { Description } from '@/app/produkt/[id]/productInfo/GeneralProductInformation'

import React, { useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, VStack } from '@navikt/ds-react'
import { TableDataCell, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { Product } from '@/utils/product-util'
import { formatAgreementPosts, formatAgreementRanks } from '@/utils/string-util'

import { Heading, Table } from '@/components/aksel-client'

import styles from '@/app/sammenlign/CompareTable.module.scss'

export const CompareMetaDataTable = ({ productsToCompare }: { productsToCompare: Product[] }) => {
  const [showTable, setShowTable] = useState(true)

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
                {productsToCompare.map((product) => {
                  return (
                    <TableDataCell key={product.id}>
                      {<Description description={product.attributes.text} />}
                    </TableDataCell>
                  )
                })}
              </TableRow>
              <TableRow>
                <TableHeaderCell className="side_header">Rangering</TableHeaderCell>
                {productsToCompare.map((product) => {
                  return (
                    <TableDataCell key={product.id}>{formatAgreementRanks(product.agreements || [])}</TableDataCell>
                  )
                })}
              </TableRow>
              <TableRow>
                <TableHeaderCell className="side_header">Delkontrakt</TableHeaderCell>
                {productsToCompare.map((product) => {
                  return (
                    <TableDataCell key={product.id}>{formatAgreementPosts(product.agreements || [])}</TableDataCell>
                  )
                })}
              </TableRow>
              <TableRow>
                <TableHeaderCell className="side_header">Antall varianter</TableHeaderCell>
                {productsToCompare.map((product) => (
                  <TableDataCell key={product.id}>{product.variantCount}</TableDataCell>
                ))}
              </TableRow>
              <TableRow>
                <TableHeaderCell className="side_header">HMS-nummer</TableHeaderCell>
                {productsToCompare.map((product) => (
                  <TableDataCell key={product.id}>
                    {product.variantCount > 1 ? 'Flere HMS-nummer' : product.variants[0].hmsArtNr}
                  </TableDataCell>
                ))}
              </TableRow>
              <TableRow>
                <TableHeaderCell className="side_header">Leverandør</TableHeaderCell>
                {productsToCompare.map((product) => (
                  <TableDataCell key={product.id}>{product.supplierName}</TableDataCell>
                ))}
              </TableRow>
            </Table.Body>
          </Table>
        )}
      </Box>
    </VStack>
  )
}
