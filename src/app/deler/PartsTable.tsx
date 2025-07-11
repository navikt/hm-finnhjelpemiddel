import { ProductVariant } from '@/utils/product-util'
import { CopyButton, Hide, Skeleton, Table } from '@navikt/ds-react'
import styles from './PartsTable.module.scss'
import { ThumbUpIcon } from '@navikt/aksel-icons'

export const PartsTable = ({ products }: { products: ProductVariant[] }) => {
  return products ? (
    <Table zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Hide below={'md'} asChild>
            <Table.HeaderCell scope="col">Leverandørnavn</Table.HeaderCell>
          </Hide>
          <Table.HeaderCell scope="col">Lev-artnr</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {products.map((product) => (
          <Table.Row key={product.id}>
            <Table.DataCell>
              <CopyButton
                size="small"
                copyText={product.hmsArtNr ?? ''}
                text={product.hmsArtNr ?? ''}
                activeText="Kopiert"
                variant="action"
                activeIcon={<ThumbUpIcon aria-hidden />}
                iconPosition="right"
                className={styles.copyButton}
              />
            </Table.DataCell>
            <Table.DataCell>{product.articleName}</Table.DataCell>
            <Hide below={'md'} asChild>
              <Table.DataCell>{product.supplierName}</Table.DataCell>
            </Hide>
            <Table.DataCell>{product.supplierRef}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ) : (
    <Skeleton />
  )
}
