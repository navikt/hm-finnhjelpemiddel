'use client'
import { Table, SortState } from '@navikt/ds-react'
import { useLayoutEffect, useRef, useState } from 'react'
import './comparing-table.scss'

type TableData = {
  headers: { id: string; label: string }[]
  rows: TableRows
}

export type TableRows = {
  [key: string]: { [cell: string]: [string, string] }
}

const ComparingTable = ({ headers, rows }: TableData) => {
  const ref = useRef(null)
  const dataHeaders = [...headers].splice(1)
  const [sort, setSort] = useState<SortState | undefined>(undefined)
  const [keyColumnWidth, setKeyColumnWidth] = useState(0)

  const handleSort = (sortKey: string | undefined) => {
    if (sortKey) {
      setSort(
        sortKey === sort?.orderBy && sort?.direction === 'descending'
          ? undefined
          : {
              orderBy: sortKey,
              direction: sortKey === sort?.orderBy && sort?.direction === 'ascending' ? 'descending' : 'ascending',
            }
      )
    } else setSort(undefined)
  }

  let sortData = Object.entries(rows)

  sortData = sortData.sort(([keyA, valuesA], [keyB, valuesB]) => {
    if (sort) {
      const comparator = (a: string, b: string) => {
        if (a < b || b === undefined) {
          return -1
        }
        if (a > b) {
          return 1
        }
        return 0
      }

      return sort.direction === 'ascending' ? comparator(keyB, keyA) : comparator(keyA, keyB)
    }
    return 1
  })

  useLayoutEffect(() => {
    setKeyColumnWidth(ref.current ? ref.current['offsetWidth'] : 0)
  }, [])

  return (
    <div className="comparing-table">
      <Table sort={sort} onSortChange={(sortKey) => handleSort(sortKey)}>
        <Table.Header>
          <Table.Row>
            {headers.map((header, index) => {
              if (index === 0) {
                return (
                  <Table.ColumnHeader scope="col" key={header.id} sortKey="name" ref={ref} sortable>
                    {header.label}
                  </Table.ColumnHeader>
                )
              } else {
                return (
                  <Table.ColumnHeader
                    scope="col"
                    key={header.id}
                    style={{ left: index === 1 ? keyColumnWidth : 'auto' }}
                  >
                    {header.label}
                  </Table.ColumnHeader>
                )
              }
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortData.map(([key, values], i) => {
            return (
              <Table.Row key={i + key}>
                <Table.HeaderCell scope="row">{key}</Table.HeaderCell>
                {dataHeaders.map((header, index) => {
                  const valueAndUnit = header.id in values ? values[header.id][0] + values[header.id][1] : '-'
                  return (
                    <Table.DataCell
                      key={key + header.id}
                      style={{ left: index === 0 && keyColumnWidth > 0 ? keyColumnWidth : 'auto' }}
                    >
                      {valueAndUnit}
                    </Table.DataCell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ComparingTable
