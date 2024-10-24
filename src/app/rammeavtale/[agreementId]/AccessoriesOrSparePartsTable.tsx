'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

import { Agreement } from '@/utils/agreement-util'
import {
  fetchAccessoriesAndSpareParts,
  FetchProductsWithPaginationResponse,
  FilterData,
  getFiltersAgreement,
} from '@/utils/api-util'
import { Alert, HGrid, HStack, Loader, Pagination, Search, Select, Show, Table } from '@navikt/ds-react'

const AccessoriesSparePartsBody = ({ agreement, isSparepart }: { agreement: Agreement; isSparepart: boolean }) => {
  const [page, setPage] = useState(1)
  const rowsPerPage = 16
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
          isSparepart: isSparepart,
        }
      : null,
    fetchAccessoriesAndSpareParts,
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
    setPage(1)
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
      <HGrid gap={{ xs: '3', md: '4' }} columns={{ xs: 1, md: 2 }} maxWidth={{ md: '600px' }} marginBlock="7 3">
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
          searchTermValue === '' ? (
            <HGrid gap="12" columns="minmax(16rem, 55rem)">
              <Alert variant="info">{`Det er ingen ${isSparepart ? 'reservedeler' : 'tilbehør'} på denne avtalen enda.`}</Alert>
            </HGrid>
          ) : (
            <HGrid gap="12" columns="minmax(16rem, 55rem)">
              <Alert variant="info">{`Det er ingen treff på søket '${searchTermValue}'.`}</Alert>
            </HGrid>
          )
        ) : searchTermValue === '' ? (
          <HGrid gap="12" columns="minmax(16rem, 55rem)">
            <Alert variant="info">
              Det er ingen {isSparepart ? 'reservedeler' : 'tilbehør'} tilknyttet {currentSelectedSupplier}.
            </Alert>
          </HGrid>
        ) : (
          <HGrid gap="12" columns="minmax(16rem, 55rem)">
            <Alert variant="info">
              {`Det er ingen treff på søket '${searchTermValue}' for ${isSparepart ? 'reservedeler' : 'tilbehør'} tilknyttet ${currentSelectedSupplier}.`}
            </Alert>
          </HGrid>
        )
      ) : (
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
              <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
              <Show above="sm" asChild>
                <Table.HeaderCell scope="col">Leverandør</Table.HeaderCell>
              </Show>
              <Table.HeaderCell scope="col">Lev-artnr</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data &&
              data.products.map((item, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.DataCell> {item.variants[0].hmsArtNr}</Table.DataCell>
                    <Table.DataCell> {item.variants[0].articleName}</Table.DataCell>
                    <Show above="sm" asChild>
                      <Table.DataCell> {item.supplierName}</Table.DataCell>
                    </Show>
                    <Table.DataCell> {item.variants[0].supplierRef}</Table.DataCell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>
      )}

      {data && data.totalHits > rowsPerPage && (
        <>
          <Show above="sm" asChild>
            <HStack marginBlock={'2'}>
              <Pagination page={page} onPageChange={setPage} count={Math.ceil(data.totalHits / rowsPerPage)} />
            </HStack>
          </Show>
          <Show below="sm" asChild>
            <HStack justify={'center'} marginBlock={'2'}>
              <Pagination
                page={page}
                onPageChange={setPage}
                count={Math.ceil(data.totalHits / rowsPerPage)}
                size="xsmall"
              />
            </HStack>
          </Show>
        </>
      )}
    </>
  )
}

export default AccessoriesSparePartsBody
