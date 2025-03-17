'use client'

import useSWR from "swr";
import { fetchCompatibleProducts } from "@/utils/api-util";
import { HGrid, Search, Table } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ProductVariant } from "@/utils/product-util";


interface Props {
  seriesId: string
}

export const PartsList = ({ seriesId }: Props) => {
  const searchParams = useSearchParams()
  const searchTermValue = searchParams.get('searchTerm') || ''
  const [inputValue, setInputValue] = useState(searchTermValue ?? '')
  const router = useRouter()
  const pathname = usePathname()

  const [filteredProducts, setFilteredProducts] = useState<ProductVariant[]>([])

  const onSearch = () => {
    router.replace(`${pathname}?searchTerm=${inputValue}`, {
      scroll: false,
    })
    if (inputValue.length > 0 && data) {
      setFilteredProducts(data.filter((product) => {
        return product.articleName.toLowerCase().includes(inputValue.toLowerCase())
      }))
    }
  }

  const { data, isLoading } = useSWR(
    seriesId,
    fetchCompatibleProducts,
    { keepPreviousData: true }
  )


  return (
    <div>
      <HGrid gap={{ xs: '3', md: '4' }} columns={{ xs: 1, md: 2 }} maxWidth={{ md: '600px' }} marginBlock="7 3">
        <Search
          defaultValue={inputValue}
          label="Søk"
          hideLabel={false}
          variant="simple"
          onChange={(value) => {
            setInputValue(value)
          }}
          onKeyUp={onSearch}
        />
      </HGrid>

      {(!inputValue || inputValue.length === 0) && data && data.length > 0 ? (
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
              <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Leverandørnavn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Lev-artnr</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((product) => (
                <Table.Row key={product.id}>
                  <Table.DataCell>{product.hmsArtNr}</Table.DataCell>
                  <Table.DataCell>{product.articleName}</Table.DataCell>
                  <Table.DataCell>{product.supplierName}</Table.DataCell>
                  <Table.DataCell>{product.supplierRef}</Table.DataCell>

                </Table.Row>
              )
            )}
          </Table.Body>
        </Table>

      ) : inputValue && inputValue.length > 0 && filteredProducts.length > 0 ? (
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
              <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Leverandørnavn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Lev-artnr</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredProducts.map((product) => (
                <Table.Row key={product.id}>
                  <Table.DataCell>{product.hmsArtNr}</Table.DataCell>
                  <Table.DataCell>{product.articleName}</Table.DataCell>
                  <Table.DataCell>{product.supplierName}</Table.DataCell>
                  <Table.DataCell>{product.supplierRef}</Table.DataCell>

                </Table.Row>
              )
            )}
          </Table.Body>
        </Table>
      ) : (

        <p>Ingen treff</p>

      )}

    </div>
  )
}
