import { Button, Table } from '@navikt/ds-react'
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@navikt/aksel-icons'
import { ProductVariant } from '@/utils/product-util'
import { defaultAriaLabel, getAriaLabel } from '@/utils/ariaLabel-util'
import { viewAgreementRanks } from '@/components/AgreementIcon'
import classNames from 'classnames'
import { SortColumns } from '@/app/produkt/variants/MultipleVariants'

interface VariantRankRowProps {
  sortedByKey: ProductVariant[]
  sortColumns: SortColumns
  handleSortRow: (key: string) => void
  sortRank: boolean
  hasAgreementSet: Set<boolean>
  handleColumnClick: (key: string) => void
  selectedColumn: string | null
}

export const VariantRankRow = ({
  sortedByKey,
  sortColumns,
  handleSortRow,
  sortRank,
  hasAgreementSet,
  selectedColumn,
  handleColumnClick,
}: VariantRankRowProps) => {
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
        { 'variants-table__sortable-row': sortRank },
        { 'variants-table__sorted-row': sortColumns.orderBy === 'rank' },
        { 'variants-table__rank-row-on-agreement': hasAgreementSet.has(true) }
      )}
    >
      {sortRank ? (
        <Table.HeaderCell className="sortable">
          <Button
            className="sort-button"
            aria-label={
              sortColumns.orderBy === 'rank'
                ? getAriaLabel({ sortColumns: sortColumns, ariaLabelKey: 'Rangering ' })
                : defaultAriaLabel + ' rangering'
            }
            aria-pressed={sortColumns.orderBy === 'rank'}
            size="xsmall"
            style={{ textAlign: 'left' }}
            variant="tertiary"
            onClick={() => handleSortRow('rank')}
            iconPosition="right"
            icon={iconBasedOnState('rank')}
          >
            Rangering
          </Button>
        </Table.HeaderCell>
      ) : (
        <Table.HeaderCell>Rangering</Table.HeaderCell>
      )}
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
