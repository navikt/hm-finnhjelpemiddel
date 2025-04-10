import { Table } from '@navikt/ds-react'
import { ProductVariant } from '@/utils/product-util'
import { formatAgreementPosts } from '@/utils/string-util'
import styles from '@/app/produkt/[id]/VariantTable.module.scss'

interface VariantPostRowProps {
  sortedByKey: ProductVariant[]
  handleColumnClick: (key: number) => void
  selectedColumn: number | null
}

export const VariantPostRow = ({ sortedByKey, selectedColumn, handleColumnClick }: VariantPostRowProps) => {
  return (
    <Table.Row>
      <Table.HeaderCell>Delkontrakt</Table.HeaderCell>
      {sortedByKey.map((variant, i) => (
        <Table.DataCell
          key={'post-' + variant.id}
          className={selectedColumn === i ? styles.selectedColumn : ''}
          onClick={() => handleColumnClick(i)}
        >
          {formatAgreementPosts(variant.agreements)}
        </Table.DataCell>
      ))}
    </Table.Row>
  )
}
