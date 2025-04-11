import { Table } from '@navikt/ds-react'
import { ProductVariant } from '@/utils/product-util'
import { viewAgreementRanks } from '@/components/AgreementIcon'
import styles from './VariantTable.module.scss'

interface VariantRankRowProps {
  variants: ProductVariant[]
  handleColumnClick: (key: number) => void
  selectedColumn: number | null
}

export const VariantRankRow = ({ variants, selectedColumn, handleColumnClick }: VariantRankRowProps) => {
  return (
    <Table.Row>
      <Table.HeaderCell>Rangering</Table.HeaderCell>
      {variants.map((variant, i) => (
        <Table.DataCell
          key={'rank-' + variant.id}
          className={selectedColumn === i ? styles.selectedColumn : ''}
          onClick={() => handleColumnClick(i)}
        >
          {viewAgreementRanks(variant.agreements)}
        </Table.DataCell>
      ))}
    </Table.Row>
  )
}
