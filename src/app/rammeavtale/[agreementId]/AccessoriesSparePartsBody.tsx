'use client'

import { Alert, HGrid, HStack, Loader, Pagination, Search, Select, Table } from '@navikt/ds-react'

import { Agreement } from '@/utils/agreement-util'
import React, { useState } from 'react'
import etacData from '../../../../mockData/Etac.json'
import lev2Data from '../../../../mockData/lev2.json'
import levUData from '../../../../mockData/levUData.json'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import useSWR from 'swr'
import { fetchProductTEMPNAME, FetchSeriesResponse } from '@/utils/api-util'
import { Product } from '@/utils/product-util'

type Supplier = {
  name: string
  data: SupplierData[]
}

type SupplierData = {
  HMSArtnr: string
  Beskrivelse: string
  LeverandørensArtnr: string
}

const AccessoriesSparePartsBody = ({ agreement, itemType }: { agreement: Agreement; itemType: string }) => {
  const [page, setPage] = useState(1)
  const rowsPerPage = 15
  const [selectSupplier, setSelectSupplier] = useState<string>('Etac')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchTermValue = searchParams.get('accessoriesTerm') || ''
  const [inputValue, setInputValue] = useState(searchTermValue ?? '')
  const [shouldFetch, setShouldFetch] = useState(true)

  const { data, isLoading, error } = useSWR<FetchSeriesResponse>(
    shouldFetch ? { agreementId: agreement.id, searchTerm: searchTermValue } : null,
    fetchProductTEMPNAME,
    { keepPreviousData: true }
  )

  const suppliers: Supplier[] = [
    { name: 'Etac', data: etacData },
    { name: 'Leverandør 2', data: lev2Data },
    { name: 'Leverandør uten data', data: levUData },
  ]

  const updateSelectedSupplier = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectSupplier(event.target.value)
    setPage(1)
  }

  const onSearch = () => {
    router.replace(`${pathname}?accessoriesTerm=${inputValue}`, {
      scroll: false,
    })
    setShouldFetch(true)
  }
  const supplierData = suppliers.find((supplier) => supplier.name === selectSupplier)?.data || []
  const supplierName = suppliers.find((supplier) => supplier.name === selectSupplier)?.name

  let sortData = supplierData
  sortData = sortData.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  return (
    <>
      <HStack gap="10">
        <div>
          <Search
            label="Søk"
            hideLabel={false}
            variant="secondary"
            onChange={(value) => {
              setShouldFetch(false)
              setInputValue(value)
            }}
            onSearchClick={(searchTerm) => {
              onSearch()
            }}
          />
        </div>
        <Select label="Velg leverandør" onChange={updateSelectedSupplier}>
          {suppliers.map((supplier, i) => (
            <option key={i} value={supplier.name}>
              {supplier.name}
            </option>
          ))}
        </Select>
      </HStack>
      {isLoading && <Loader size="3xlarge" />}

      {data && data.products.length === 0 ? (
        <HGrid gap="12" columns="minmax(16rem, 55rem)" paddingBlock="4">
          <Alert variant="info">
            Det er ingen {itemType} tilknyttet {supplierName}.
          </Alert>
        </HGrid>
      ) : (
        supplierData && (
          <Table zebraStripes>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
                <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                <Table.HeaderCell scope="col">Leverandør artikkelnummer</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data &&
                data.products.map((item, i) => (
                  <Table.Row key={i}>
                    <Table.DataCell> {item.variants[0].hmsArtNr}</Table.DataCell>
                    <Table.DataCell> {item.title}</Table.DataCell>
                    <Table.DataCell> {item.variants[0].supplierRef}</Table.DataCell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        )
      )}

      {data && data.products.length > rowsPerPage && (
        <Pagination
          page={page}
          onPageChange={setPage}
          count={Math.ceil(data.products.length / rowsPerPage)}
          size="small"
        />
      )}
    </>
  )
}

export default AccessoriesSparePartsBody
