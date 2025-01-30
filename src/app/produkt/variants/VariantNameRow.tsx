import { Button, Table } from '@navikt/ds-react';
import { ProductVariant } from '@/utils/product-util';
import { SortColumns } from '@/app/produkt/variants/MultipleVariantsTable';
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from "@navikt/aksel-icons";

interface Props {
  variants: ProductVariant[]
  sortColumns: SortColumns
  handleSortRow: (key: string) => void
  variantNameElementRef: React.RefObject<HTMLTableCellElement>
}

export const VariantNameRow = ({ variants, sortColumns, handleSortRow, variantNameElementRef }: Props) => {

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
    <Table.Row className="variants-table__sortable-row">
      <Table.ColumnHeader className="sortable" ref={variantNameElementRef}>
        <Button
          className="sort-button"
          aria-label="Sort by variant name"
          aria-pressed={sortColumns.orderBy === 'artName'}
          size="xsmall"
          style={{ textAlign: 'left' }}
          variant="tertiary"
          onClick={() => handleSortRow('artName')}
          iconPosition="right"
          icon={iconBasedOnState('artName')}
        >
          Navn på variant
        </Button>
      </Table.ColumnHeader>
      {variants.map((variant) => (
        <Table.ColumnHeader key={'artname-' + variant.id}>{variant.articleName}</Table.ColumnHeader>
      ))}
    </Table.Row>
  )
};
