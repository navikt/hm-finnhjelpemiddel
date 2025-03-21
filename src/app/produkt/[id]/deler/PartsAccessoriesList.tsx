import { ProductVariant } from "@/utils/product-util";
import { Table } from "@navikt/ds-react";
import { PackageIcon, WrenchIcon } from "@navikt/aksel-icons";

export const PartsAccessoriesList = ({ products }: { products: ProductVariant[] }) => {

  return (
    <Table zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Table.HeaderCell scope="col">Leverandørnavn</Table.HeaderCell>
          <Table.HeaderCell scope="col">Lev-artnr</Table.HeaderCell>
          <Table.HeaderCell scope="col"></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {products.map((product) => (
            <Table.Row key={product.id}>
              <Table.DataCell>{product.hmsArtNr}</Table.DataCell>
              <Table.DataCell>{product.articleName}</Table.DataCell>
              <Table.DataCell>{product.supplierName}</Table.DataCell>
              <Table.DataCell>{product.supplierRef}</Table.DataCell>
              <Table.DataCell>{product.sparePart ?
                <WrenchIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} /> :
                <PackageIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} />}</Table.DataCell>
            </Table.Row>
          )
        )}
      </Table.Body>
    </Table>
  )
}
