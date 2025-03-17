'use client'

import useSWR from "swr";
import { fetchCompatibleProducts } from "@/utils/api-util";
import { Table } from "@navikt/ds-react";


interface Props {
  seriesId: string
}

export const PartsList = ({ seriesId }: Props) => {

  const { data, isLoading } = useSWR(
    seriesId,
    fetchCompatibleProducts,
    { keepPreviousData: true }
  )

  return (
    <div>
      {data && data.length > 0 ? (
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

      ) : (

        <p>Ingen deler er koblet på dette produktet</p>

      )}

    </div>
  )
}
