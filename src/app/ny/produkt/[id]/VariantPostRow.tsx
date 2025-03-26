import { Table } from '@navikt/ds-react'
import { ProductVariant } from '@/utils/product-util'
import { formatAgreementPosts } from '@/utils/string-util'

interface VariantPostRowProps {
  sortedByKey: ProductVariant[]
  handleColumnClick: (key: string) => void
  selectedColumn: string | null
}

export const VariantPostRow = ({ sortedByKey, selectedColumn, handleColumnClick }: VariantPostRowProps) => {
  return (
    <Table.Row>
      <Table.HeaderCell>Delkontrakt</Table.HeaderCell>
      {sortedByKey.map((variant, i) => (
        <Table.DataCell
          key={'post-' + variant.id}
          className={selectedColumn === variant.id ? 'selected-column' : ''}
          onClick={() => handleColumnClick(variant.id)}
        >
          {formatAgreementPosts(variant.agreements)}
        </Table.DataCell>
      ))}
    </Table.Row>
  )
}
