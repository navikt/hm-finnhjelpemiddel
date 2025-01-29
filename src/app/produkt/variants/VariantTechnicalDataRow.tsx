import { Table, Button } from '@navikt/ds-react';
import classNames from 'classnames';
import { getAriaLabel, defaultAriaLabel } from '@/utils/ariaLabel-util';
import { SortColumns } from '@/app/produkt/variants/MultipleVariantsTable';

interface VariantDataRowProps {
  technicalDataName: string;
  row: string[];
  sortColumns: SortColumns;
  handleSortRow: (key: string) => void;
  isSortableRow: boolean;
  iconBasedOnState: (key: string) => JSX.Element;
}

export const VariantTechnicalDataRow = ({ technicalDataName, row, sortColumns, handleSortRow, isSortableRow, iconBasedOnState }: VariantDataRowProps) => (
  <Table.Row
    key={technicalDataName + 'row'}
    className={classNames(
      { 'variants-table__sorted-row': technicalDataName === sortColumns.orderBy },
      { 'variants-table__sortable-row': isSortableRow }
    )}
  >
    {isSortableRow ? (
      <Table.HeaderCell className="sortable">
        <Button
          className="sort-button"
          aria-label={
            sortColumns.orderBy === technicalDataName
              ? getAriaLabel({ sortColumns: sortColumns, ariaLabelKey: technicalDataName + ' ' })
              : defaultAriaLabel + ' ' + technicalDataName.toLowerCase()
          }
          aria-pressed={sortColumns.orderBy === technicalDataName}
          size="xsmall"
          style={{ textAlign: 'left' }}
          variant="tertiary"
          onClick={() => handleSortRow(technicalDataName)}
          iconPosition="right"
          icon={iconBasedOnState(technicalDataName)}
        >
          {technicalDataName}
        </Button>
      </Table.HeaderCell>
    ) : (
      <Table.HeaderCell>{technicalDataName}</Table.HeaderCell>
    )}
    {row.map((value, i) => (
      <Table.DataCell key={technicalDataName + '-' + i}>{value}</Table.DataCell>
    ))}
  </Table.Row>
);
