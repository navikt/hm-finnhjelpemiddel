import { Table } from '@navikt/ds-react'
import './comparing-table.scss'

type TableData = {
  headers: { id: string; label: string }[]
  rows: TableRows
}

export type TableRows = {
  [key: string]: { [cell: string]: string }
}

const ComparingTable = ({ headers, rows }: TableData) => {
  const dataHeaders = [...headers].splice(1)

  return (
    <div className="comparing-table">
      <Table>
        <Table.Header>
          <Table.Row>
            {headers.map((header, index) => {
              return (
                <Table.HeaderCell scope="col" key={index}>
                  {header.label}
                </Table.HeaderCell>
              )
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(rows).map(([key, values], i) => {
            return (
              <Table.Row key={i + key}>
                <Table.HeaderCell scope="row">{key}</Table.HeaderCell>
                {dataHeaders.map((header, index) => {
                  if (header.id in values) {
                    return <Table.DataCell key={index}>{values[header.id]}</Table.DataCell>
                  } else {
                    return <Table.DataCell key={index}>-</Table.DataCell>
                  }
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
