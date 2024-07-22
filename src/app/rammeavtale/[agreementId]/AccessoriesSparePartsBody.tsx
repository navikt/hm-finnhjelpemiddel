'use client'

import { Alert, HGrid, HStack, Loader, Pagination, Search, Select, Table } from '@navikt/ds-react'

import { Agreement } from '@/utils/agreement-util'
import React, { useState } from 'react'
import etacData from '../../../../mockData/Etac.json'
import lev2Data from '../../../../mockData/lev2.json'
import levUData from '../../../../mockData/levUData.json'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import useSWR from 'swr'
import { fetchProductTEMPNAME, FetchSeriesResponse, FilterData, getFiltersAgreement } from '@/utils/api-util'
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
  const [currentSelectedSupplier, setcurrentSelectedSupplier] = useState<string>('')
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

  const { data: filtersFromData, isLoading: filtersIsLoading } = useSWR<FilterData>(
    { agreementId: agreement.id, type: 'filterdata' },
    getFiltersAgreement,
    {
      keepPreviousData: true,
    }
  )
  const supplierNames = filtersFromData && filtersFromData.leverandor.values


  const onSearch = () => {
    router.replace(`${pathname}?accessoriesTerm=${inputValue}`, {
      scroll: false,
    })
    setShouldFetch(true)
  }

  //const supplierName = suppliers.key.find((supplier) => supplier.name === selectSupplier)?.name

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
        <Select label="Velg leverandør" onChange={(val) =>setcurrentSelectedSupplier(val.target.value)}>
          {supplierNames && supplierNames.map((supplier, i) => (
            <option key={i} value={supplier.key}>
              {supplier.key}
            </option>
          ))}
        </Select>
      </HStack>
      {isLoading && <Loader size="3xlarge" />}

      {data && data.products.length === 0 ? (
        <HGrid gap="12" columns="minmax(16rem, 55rem)" paddingBlock="4">
          <Alert variant="info">
            Det er ingen {itemType} tilknyttet {currentSelectedSupplier}.
          </Alert>
        </HGrid>
      ) : (
        (
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
