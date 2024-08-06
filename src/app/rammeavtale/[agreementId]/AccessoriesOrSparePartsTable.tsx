'use client'

import { Alert, HGrid, Loader, Pagination, Search, Select, Table } from '@navikt/ds-react'

import { Agreement } from '@/utils/agreement-util'
import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import useSWR from 'swr'
import {
  FetchProductsWithPaginationResponse,
  fetchProductTEMPNAME,
  FilterData,
  getFiltersAgreement,
} from '@/utils/api-util'

const AccessoriesSparePartsBody = ({ agreement, itemType }: { agreement: Agreement; itemType: string }) => {
  const [page, setPage] = useState(1)
  const rowsPerPage = 15
  const [currentSelectedSupplier, setCurrentSelectedSupplier] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchTermValue = searchParams.get('accessoriesTerm') || ''
  const [inputValue, setInputValue] = useState(searchTermValue ?? '')
  const [shouldFetch, setShouldFetch] = useState(true)

  const { data, isLoading, error } = useSWR<FetchProductsWithPaginationResponse>(
    shouldFetch
      ? {
        agreementId: agreement.id,
        searchTerm: searchTermValue,
        selectedSupplier: currentSelectedSupplier,
        pageSize: rowsPerPage,
        currentPage: page,
      }
      : null,
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

  const handleOptions = (optionsTargetValue: string) => {
    if (optionsTargetValue === 'ALL') {
      setCurrentSelectedSupplier(null)
    } else {
      setCurrentSelectedSupplier(optionsTargetValue)
    }
  }

  return (
    <>
      <HGrid gap={{ xs: '3', md: '4' }} columns={{ xs: 1, md: 2 }} maxWidth={{ md: "600px" }} marginBlock="10 4">
        <Search
          defaultValue={inputValue}
          label="Søk"
          hideLabel={false}
          variant="simple"
          clearButton={false}
          onChange={(value) => {
            setInputValue(value)
          }}
          onKeyUp={onSearch}
        />
        <Select
          label="Leverandør"
          onChange={(option) => {
            handleOptions(option.target.value)
            setShouldFetch(true)
            setPage(1)
          }}
        >
          <option key={0} value={'ALL'}>
            Alle
          </option>
          {supplierNames &&
            supplierNames.map((supplier, i) => (
              <option key={i + 1} value={supplier.key}>
                {supplier.key}
              </option>
            ))}
        </Select>
      </HGrid>
      {isLoading && <Loader size="3xlarge" />}

      {data && data.products.length === 0 ? (
        currentSelectedSupplier === null ? (
          <HGrid gap="12" columns="minmax(16rem, 55rem)" paddingBlock="4">
            <Alert variant="info">{`Det er ingen treff på søket '${searchTermValue}'.`}</Alert>
          </HGrid>
        ) : inputValue === '' ? (
          <HGrid gap="12" columns="minmax(16rem, 55rem)" paddingBlock="4">
            <Alert variant="info">
              Det er ingen {itemType} tilknyttet {currentSelectedSupplier}.
            </Alert>
          </HGrid>
        ) : (
          <HGrid gap="12" columns="minmax(16rem, 55rem)" paddingBlock="4">
            <Alert variant="info">
              {`Det er ingen treff på søket '${searchTermValue}' for ${itemType} tilknyttet ${currentSelectedSupplier}.`}
            </Alert>
          </HGrid>
        )
      ) : (
        <Table zebraStripes >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
              <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell scope="col">Leverandør</Table.HeaderCell>
              <Table.HeaderCell scope="col">Leverandør artikkelnummer</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data &&
              data.products.map((item, i) => (
                <Table.Row key={i}>
                  <Table.DataCell> {item.variants[0].hmsArtNr}</Table.DataCell>
                  <Table.DataCell> {item.title}</Table.DataCell>
                  <Table.DataCell> {item.supplierName}</Table.DataCell>
                  <Table.DataCell> {item.variants[0].supplierRef}</Table.DataCell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}

      {data && data.totalHits > rowsPerPage && (
        <Pagination page={page} onPageChange={setPage} count={Math.ceil(data.totalHits / rowsPerPage)} size="small" />
      )}
    </>
  )
}

export default AccessoriesSparePartsBody
