import { Button, CopyButton, Table } from '@navikt/ds-react'
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon, ThumbUpIcon } from '@navikt/aksel-icons'
import { ProductVariant } from '@/utils/product-util'
import { logActionEvent } from '@/utils/amplitude'
import classNames from 'classnames'

interface VariantSupplierRefRowProps {
  sortedByKey: ProductVariant[]
  sortColumns: { orderBy: string | null; direction: 'ascending' | 'descending' }
  handleSortRow: (key: string) => void
  handleColumnClick: (key: string) => void
  selectedColumn: string | null
}

export const VariantSupplierRefRow = ({
  sortedByKey,
  sortColumns,
  handleSortRow,
  selectedColumn,
  handleColumnClick,
}: VariantSupplierRefRowProps) => {
  const iconBasedOnState = (key: string) => {
    return sortColumns.orderBy === key ? (
      sortColumns.direction === 'ascending' ? (
        <ArrowUpIcon title="Sort ascending" height={30} width={30} aria-hidden={true} />
      ) : (
        <ArrowDownIcon title="Sort descending" height={30} width={30} aria-hidden={true} />
      )
    ) : (
      <ArrowsUpDownIcon title="Sort direction not set" height={30} width={30} aria-hidden={true} />
    )
  }

  return (
    <Table.Row
      className={classNames(
        { 'variants-table__sortable-row': sortedByKey.length > 1 },
        { 'variants-table__sorted-row': sortColumns.orderBy === 'levart' }
      )}
    >
      <Table.HeaderCell className="sortable">
        <Button
          className="sort-button"
          aria-label={
            sortColumns.orderBy === 'levart'
              ? `Sort by Lev-artnr (current direction: ${sortColumns.direction})`
              : 'Sort by Lev-artnr'
          }
          aria-pressed={sortColumns.orderBy === 'levart'}
          size="xsmall"
          style={{ textAlign: 'left' }}
          variant="tertiary"
          onClick={() => handleSortRow('levart')}
          iconPosition="right"
          icon={iconBasedOnState('levart')}
        >
          Lev-artnr
        </Button>
      </Table.HeaderCell>

      {sortedByKey.map((variant, i) => (
        <Table.DataCell
          key={'supref-' + variant.id}
          className={selectedColumn === variant.id ? 'selected-column' : ''}
          onClick={() => handleColumnClick(variant.id)}
        >
          {variant.supplierRef ? (
            <CopyButton
              size="small"
              className="hms-copy-button"
              copyText={variant.supplierRef}
              text={variant.supplierRef}
              activeText="Kopiert"
              variant="action"
              activeIcon={<ThumbUpIcon aria-hidden={true} />}
              iconPosition="right"
              onClick={() => logActionEvent('kopier')}
            />
          ) : (
            '-'
          )}
        </Table.DataCell>
      ))}
    </Table.Row>
  )
}
