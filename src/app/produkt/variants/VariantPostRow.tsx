import { Button, Table } from '@navikt/ds-react';
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@navikt/aksel-icons';
import { ProductVariant } from '@/utils/product-util';
import { defaultAriaLabel, getAriaLabel } from '@/utils/ariaLabel-util';
import { formatAgreementPosts } from '@/utils/string-util';
import classNames from 'classnames';

interface VariantPostRowProps {
  sortedByKey: ProductVariant[];
  sortColumns: { orderBy: string | null; direction: 'ascending' | 'descending' };
  handleSortRow: (key: string) => void;
  postSet: Set<number>;
  sortRank: boolean;
  handleColumnClick: (key: string) => void;
  selectedColumn: string | null;
}

export const VariantPostRow = ({
  sortedByKey, sortColumns, handleSortRow, postSet, sortRank, selectedColumn,
  handleColumnClick
}: VariantPostRowProps) => {
  const iconBasedOnState = (key: string) => {
    return sortColumns.orderBy === key ? (
      sortColumns.direction === 'ascending' ? (
        <ArrowUpIcon title="Sort ascending" height={30} width={30} aria-hidden={true} />
      ) : (
        <ArrowDownIcon title="Sort descending" height={30} width={30} aria-hidden={true} />
      )
    ) : (
      <ArrowsUpDownIcon title="Sort direction not set" height={30} width={30} aria-hidden={true} />
    );
  };

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
        <Table.DataCell key={'post-' + variant.id}
                        className={selectedColumn === ('column-' + i) ? 'selected-column' : ''}
                        onClick={() => handleColumnClick('column-' + i)}>
          {formatAgreementPosts(variant.agreements)}
        </Table.DataCell>
      ))}
    </Table.Row>
  );
};
