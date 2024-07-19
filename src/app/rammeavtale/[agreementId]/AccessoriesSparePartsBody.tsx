'use client'

import { Alert, HStack, Pagination, Search, Select, Table } from '@navikt/ds-react'

import { Agreement } from '@/utils/agreement-util'
import React, { useState } from 'react'
import etacData from '../../../../mockData/Etac.json'
import lev2Data from '../../../../mockData/lev2.json'

type Supplier = {
  name: string
  data: SupplierData[]
}

type SupplierData = {
  HMSArtnr: string
  Beskrivelse: string
  LeverandørensArtnr: string
}

const AccessoriesSparePartsBody = ({ agreement }: { agreement: Agreement }) => {
  const [page, setPage] = useState(1)
  const rowsPerPage = 14
  const [selectSupplier, setSelectSupplier] = useState<string>('Etac')

  const suppliers: Supplier[] = [
    { name: 'Etac', data: etacData },
    { name: 'Leverandør 2', data: lev2Data },
  ]

  const updateSelectedSupplier = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectSupplier(event.target.value)
  }

  const supplierData = suppliers.find((supplier) => supplier.name === selectSupplier)?.data || []

  return (
    <>
      <form role="search">
        <HStack gap="10">
          <div>
            <Search label="Søk" hideLabel={false} variant="secondary" />
          </div>
          <Select label="Velg leverandør" onChange={updateSelectedSupplier}>
            {suppliers.map((supplier, i) => (
              <option key={i} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </Select>
        </HStack>
      </form>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
            <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
            <Table.HeaderCell scope="col">Leverandør artikkelnummer</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {supplierData.map((item, i) => (
            <Table.Row key={i}>
              <Table.DataCell> {item.HMSArtnr}</Table.DataCell>
              <Table.DataCell> {item.Beskrivelse}</Table.DataCell>
              <Table.DataCell> {item.LeverandørensArtnr}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {/*    {false && (
        <Pagination
          page={page}
          onPageChange={setPage}
          count={Math.ceil(3 / rowsPerPage)} //Erstatt 3 med tilbeør /reservedeler datalengde
          size="small"
        />
      )}*/}
    </>
  )
}

export default AccessoriesSparePartsBody
