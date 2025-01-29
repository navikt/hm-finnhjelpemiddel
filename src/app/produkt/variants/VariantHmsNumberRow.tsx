import { Table, Button, CopyButton } from '@navikt/ds-react';
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon, ThumbUpIcon } from '@navikt/aksel-icons';
import { ProductVariant } from '@/utils/product-util';
import { logActionEvent } from '@/utils/amplitude';
import classNames from 'classnames';

interface HmsNumberRowProps {
  sortedByKey: ProductVariant[];
  sortColumns: { orderBy: string | null; direction: 'ascending' | 'descending' };
  handleSortRow: (key: string) => void;
  variantNameElementHeight: number;
}

const VariantHmsNumberRow = ({ sortedByKey, sortColumns, handleSortRow, variantNameElementHeight }: HmsNumberRowProps) => {
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
        { 'variants-table__sortable-row': true },
        {
          'variants-table__sorted-row': sortColumns.orderBy === 'HMS',
        }
      )}
    >
      <Table.HeaderCell
        className="sortable hmsnr-header-cell"
        style={{ top: `${variantNameElementHeight}px` }}
      >
        <Button
          className="sort-button"
          aria-label={
            sortColumns.orderBy === 'HMS'
              ? `Sort by HMS-nummer (current direction: ${sortColumns.direction})`
              : 'Sort by HMS-nummer'
          }
          aria-pressed={sortColumns.orderBy === 'HMS'}
          size="xsmall"
          style={{ textAlign: 'left' }}
          variant="tertiary"
          onClick={() => handleSortRow('HMS')}
          iconPosition="right"
          icon={iconBasedOnState('HMS')}
        >
          HMS-nummer
        </Button>
      </Table.HeaderCell>
      {sortedByKey.map((variant) => (
        <Table.DataCell
          key={'hms-' + variant.id}
          style={{
            position: 'sticky',
            top: `${variantNameElementHeight}px`,
            zIndex: '1 !important',
            background: 'rgb(242 243 245)',
          }}
        >
          {variant.hmsArtNr ? (
            <CopyButton
              size="small"
              className="hms-copy-button"
              copyText={variant.hmsArtNr}
              text={variant.hmsArtNr}
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
  );
};

export default VariantHmsNumberRow;
