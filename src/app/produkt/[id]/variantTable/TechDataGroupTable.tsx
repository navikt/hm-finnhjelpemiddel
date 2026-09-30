'use client'

import { HighlightableDataCell, TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTable'

import React, { Dispatch, SetStateAction, useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, Heading, Table } from '@navikt/ds-react'

import { toValueAndUnit } from '@/utils/string-util'

import styles from '@/app/produkt/[id]/variantTable/VariantTable.module.scss'

export const TechDataGroupTable = ({
  title,
  techDataRows,
  highlightCol,
  setHighlightCol,
}: {
  title: string
  techDataRows: TechDataRow[]
  highlightCol: number
  setHighlightCol: Dispatch<SetStateAction<number>>
}) => {
  const [showTable, setShowTable] = useState(true)

  const rowsMerged: TechDataRow[] = []

  const allRowKeys = new Set(techDataRows.map(({ key }) => key))

  techDataRows.forEach((techDataRow) => {
    if (techDataRow.key.endsWith(' min')) {
      /*      const baseKey = techDataRow.key.split(' min')[0]*/
      const baseKey = techDataRow.key.slice(0, -4)
      const maksRow = techDataRows.find((otherRow) => otherRow.key === `${baseKey} maks`)

      if (maksRow !== undefined) {
        rowsMerged.push({
          key: baseKey,
          unit: techDataRow.unit,
          values: mergeMinMaksValues(techDataRow.values, maksRow.values),
          type: techDataRow.type,
        })
      } else {
        rowsMerged.push(techDataRow)
      }
      /*        } else if (techDataRow.key.endsWith(' maks') && `${allRowKeys.has(techDataRow.key.split(' maks')[0])} min`) {*/
    } else if (techDataRow.key.endsWith(' maks') && allRowKeys.has(`${techDataRow.key.slice(0, -5)} min`)) {
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

  const sortRows = (a: TechDataRow, b: TechDataRow) => {
    const unitOrder = new Map<string, number>([
      ['cm', 35],
      ['mm', 34],
      ['"', 9],
      ['°', 8],
      ['%', 7],
      ['', 6],
    ])

    const typeOrder = new Map<string, number>([
      ['N', 3],
      ['C', 2],
      ['L', 1],
      ['', 0],
    ])

    if (a.type !== b.type) {
      return (typeOrder.get(b.type) ?? 0) - (typeOrder.get(a.type) ?? 0)
    }

    if (a.unit !== b.unit) {
      return (unitOrder.get(b.unit ?? '') ?? 0) - (unitOrder.get(a.unit ?? '') ?? 0)
    }

    return a.key.localeCompare(b.key)
  }

  return (
    <Box className={styles.techDataGroup}>
      <Button
        variant="tertiary"
        data-color={'neutral'}
        onClick={() => setShowTable((value) => !value)}
        className={styles.expandTableButton}
        aria-expanded={showTable}
      >
        <HStack gap={'space-8'} align={'center'}>
          <Heading size={'medium'} level={'3'} style={{ fontSize: '18px' }}>
            {title}
          </Heading>
          {showTable ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
        </HStack>
      </Button>
      {showTable && (
        <Table>
          <Table.Body>
            {rowsMerged.sort(sortRows).map(({ key, values, unit }) => {
              return (
                <Table.Row key={key + 'row'}>
                  <Table.HeaderCell>{key}</Table.HeaderCell>
                  {values.map((value, i) => (
                    <HighlightableDataCell
                      key={key + '-' + i}
                      variantCount={values.length}
                      thisColumnNr={i}
                      highlightColNr={highlightCol}
                      setHighlightCol={setHighlightCol}
                    >
                      {toValueAndUnit(value, unit)}
                    </HighlightableDataCell>
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
