import { Table } from '@navikt/ds-react'
import { ProductVariant } from '@/utils/product-util'
import { viewAgreementRanks } from '@/components/AgreementIcon'
import classNames from 'classnames'
import styles from './VariantTable.module.scss'

interface VariantRankRowProps {
  sortedByKey: ProductVariant[]
  hasAgreementSet: Set<boolean>
  handleColumnClick: (key: number) => void
  selectedColumn: number | null
}

export const VariantRankRow = ({
  sortedByKey,
  hasAgreementSet,
  selectedColumn,
  handleColumnClick,
}: VariantRankRowProps) => {
  return (
    <Table.Row className={classNames({ 'variants-table__rank-row-on-agreement': hasAgreementSet.has(true) })}>
      <Table.HeaderCell>Rangering</Table.HeaderCell>
      {sortedByKey.map((variant, i) => (
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
