import { Table } from '@navikt/ds-react'
import { ProductVariant } from '@/utils/product-util'
import { viewAgreementRanks } from '@/components/AgreementIcon'
import classNames from 'classnames'

interface VariantRankRowProps {
  sortedByKey: ProductVariant[]
  hasAgreementSet: Set<boolean>
  handleColumnClick: (key: string) => void
  selectedColumn: string | null
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
          className={selectedColumn === variant.id ? 'selected-column' : ''}
          onClick={() => handleColumnClick(variant.id)}
        >
          {viewAgreementRanks(variant.agreements)}
        </Table.DataCell>
      ))}
    </Table.Row>
  )
}
