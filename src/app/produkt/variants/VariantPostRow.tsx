import { Button, Table } from '@navikt/ds-react'
import { ProductVariant } from '@/utils/product-util'
import { defaultAriaLabel, getAriaLabel } from '@/utils/ariaLabel-util'
import { formatAgreementPosts } from '@/utils/string-util'
import classNames from 'classnames'
import { ReactNode } from 'react'

interface VariantPostRowProps {
  sortedByKey: ProductVariant[]
  sortColumns: { orderBy: string | null; direction: 'ascending' | 'descending' }
  handleSortRow: (key: string) => void
  postSet: Set<number>
  sortRank: boolean
  handleColumnClick: (key: string) => void
  selectedColumn: string | null
  iconBasedOnState: (key: string) => ReactNode
}

export const VariantPostRow = ({
  sortedByKey,
  sortColumns,
  handleSortRow,
  postSet,
  sortRank,
  selectedColumn,
  handleColumnClick,
  iconBasedOnState,
}: VariantPostRowProps) => {
  return (
    <Table.Row
      className={classNames(
        { 'variants-table__sortable-row': postSet.size > 1 },
        { 'variants-table__sorted-row': sortColumns.orderBy === 'postNr' }
      )}
    >
      {sortRank ? (
        <Table.HeaderCell className="sortable">
          <Button
            className="sort-button"
            aria-label={
              sortColumns.orderBy === 'postNr'
                ? getAriaLabel({ sortColumns: sortColumns, ariaLabelKey: 'Delkontrakt ' })
                : defaultAriaLabel + ' delkontrakt'
            }
            aria-pressed={sortColumns.orderBy === 'postNr'}
            size="xsmall"
            style={{ textAlign: 'left' }}
            variant="tertiary"
            onClick={() => handleSortRow('postNr')}
            iconPosition="right"
            icon={iconBasedOnState('postNr')}
          >
            Delkontrakt
          </Button>
        </Table.HeaderCell>
      ) : (
        <Table.HeaderCell>Delkontrakt</Table.HeaderCell>
      )}
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
